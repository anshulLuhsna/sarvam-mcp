# MCP Server for Sarvam AI Tools

This project provides a minimal Model Context Protocol (MCP) server that exposes a set of Sarvam AI language and speech tools as callable functions. The server is designed for easy integration and experimentation with Sarvam's capabilities via the MCP interface.

## Offered Tools

- **Speech to Text**: Transcribe audio files to text using Sarvam's ASR models.
- **Text to Speech**: Convert text into natural-sounding speech in various languages and voices.
- **Speech to Text Translate**: Transcribe and translate audio directly to a target language.
- **Call Analytics**: Analyze call audio for summaries, insights, and question answering.
- **Text Translation**: Translate text between supported languages using Sarvam's translation models.
- **Sarvam Documentation Retriever (`get_sarvam_documentation_file`)**: Retrieves the content of the most relevant local Sarvam AI markdown documentation file.
    - Searches in `docs/api-ref`, `docs/cookbook`, and `docs/docs-section` by default.
    - **Parameters**:
        - `search_term` (string, required): Keywords, topic description, or filename to search for.
        - `doc_area` (string, optional): Specific documentation area (e.g., 'api-ref', 'cookbook') to narrow the search.

All tools are implemented using the official Sarvam SDK and are discoverable via the MCP server interface.

## Configuration

To use the tools that interact with the Sarvam AI API, you need to provide your personal Sarvam API key.

### Method 1: Using a `.env` file (Recommended for direct use)

1.  In the root directory of this server, create a file named `.env`.
2.  Add your Sarvam API key to this file in the following format:
    ```
    SARVAM_API_KEY=your_actual_sarvam_api_key_here
    ```
3.  Replace `your_actual_sarvam_api_key_here` with your key.
4.  The server will automatically load this key when it starts.

### Method 2: Using Client-Specific `mcp.json` (for MCP Clients like Cursor, Claude Desktop)

If you are integrating this server with an MCP client application that uses an `mcp.json` configuration file (or similar), you can usually set the API key as an environment variable within that client's configuration for this server.

For example, in the client's `mcp.json` file, the entry for this server might look like:

```json
{
  "mcpServers": {
    "sarvam-mcp-server": { // A name you choose for this server
      "command": "node", // Or your specific command to run the server
      "args": ["/path/to/your/postman-mcp-server/mcpServer.js"], // Adjust path and add flags like --sse if needed
      "env": {
        "SARVAM_API_KEY": "YOUR_SARVAM_API_KEY_HERE"
      }
    }
    // ... other servers
  }
}
```

Replace `YOUR_SARVAM_API_KEY_HERE` with your actual key and adjust the `command` and `args` to point to where you have this MCP server and how you want to run it.

**Note:** Environment variables set through the client's `mcp.json` will typically override those in a local `.env` file if both are present.

Ensure your `.env` file is included in your `.gitignore` if you are managing this project with Git.
