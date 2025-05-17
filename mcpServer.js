#!/usr/bin/env node
import dotenv from "dotenv";
import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { discoverTools } from "./lib/tools.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const SERVER_NAME = "generated-mcp-server";

async function transformTools(tools) {
  return tools
    .map((tool) => {
      const definitionFunction = tool.definition?.function;
      if (!definitionFunction) return;
      return {
        name: definitionFunction.name,
        description: definitionFunction.description,
        inputSchema: definitionFunction.parameters,
      };
    })
    .filter(Boolean);
}

async function run() {
  const args = process.argv.slice(2);
  const isSSE = args.includes("--sse");

  const server = new Server(
    {
      name: SERVER_NAME,
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.onerror = (error) => console.error("[Error]", error);

  // Gracefully shutdown on SIGINT
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  const tools = await discoverTools();

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await transformTools(tools),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const tool = tools.find((t) => t.definition.function.name === toolName);

    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }

    const args = request.params.arguments;
    const requiredParameters =
      tool.definition?.function?.parameters?.required || [];

    for (const requiredParameter of requiredParameters) {
      if (!(requiredParameter in args)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required parameter: ${requiredParameter}`
        );
      }
    }

    // Prepare a context for the tool to call other tools
    const toolExecutionContext = {
      callTool: async (targetToolName, targetToolArgs) => {
        console.log(`[Internal Tool Call] Attempting to call ${targetToolName} with args:`, targetToolArgs);
        const targetTool = tools.find((t) => t.definition.function.name === targetToolName);
        if (!targetTool) {
          console.error(`[Internal Tool Call Error] Tool not found: ${targetToolName}`);
          // This kind of error should ideally not be directly sent to the original client as an McpError
          // if it implies an internal server misconfiguration or bad tool design.
          // Instead, the calling tool should handle this gracefully.
          // For now, we'll throw an error that the calling tool can catch.
          throw new Error(`Internal: Target tool ${targetToolName} not found.`);
        }
        
        // Note: This is a direct call to the function. 
        // It bypasses the main server's request/response schema validation for this internal call.
        // It assumes that the arguments are already in the correct format expected by the targetTool.function.
        // The context is passed along for potentially deeper nested calls.
        try {
          // Assuming targetTool.function now accepts (args, context)
          const result = await targetTool.function(targetToolArgs, toolExecutionContext);
          // The result here is the direct return value of the targetTool's function.
          // It's NOT the full McpResponse structure.
          console.log(`[Internal Tool Call] Result from ${targetToolName}:`, result);
          return result; 
        } catch (internalError) {
          console.error(`[Internal Tool Call Error] Error during execution of ${targetToolName}:`, internalError);
          // Propagate the error so the calling tool can decide how to handle it.
          // It might be an McpError if the target tool threw one, or a generic Error.
          throw internalError; 
        }
      }
    };

    try {
      // Ensure your tool functions are defined to accept this second parameter (context)
      // e.g., const executeSomeFunction = async (args, context) => { ... }
      const result = await tool.function(args, toolExecutionContext);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`[Error] Failed to execute tool ${toolName}:`, error);
      if (error instanceof McpError) { // Re-throw McpErrors directly
        throw error;
      }
      // Wrap other errors in McpError.InternalError
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error.message}`
      );
    }
  });

  if (isSSE) {
    const app = express();
    const transports = {};

    app.get("/sse", async (_req, res) => {
      const transport = new SSEServerTransport("/messages", res);
      transports[transport.sessionId] = transport;

      res.on("close", () => {
        delete transports[transport.sessionId];
      });

      await server.connect(transport);
    });

    app.post("/messages", async (req, res) => {
      const sessionId = req.query.sessionId;
      const transport = transports[sessionId];

      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(400).send("No transport found for sessionId");
      }
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`[SSE Server] running on port ${port}`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

run().catch(console.error);
