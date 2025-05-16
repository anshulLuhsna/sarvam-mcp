# MCP Server for Sarvam AI Tools

This project provides a minimal Model Context Protocol (MCP) server that exposes a set of Sarvam AI language and speech tools as callable functions. The server is designed for easy integration and experimentation with Sarvam's capabilities via the MCP interface.

## Offered Tools

- **Speech to Text**: Transcribe audio files to text using Sarvam's ASR models.
- **Text to Speech**: Convert text into natural-sounding speech in various languages and voices.
- **Speech to Text Translate**: Transcribe and translate audio directly to a target language.
- **Call Analytics**: Analyze call audio for summaries, insights, and question answering.
- **Text Translation**: Translate text between supported languages using Sarvam's translation models.

All tools are implemented using the official Sarvam SDK and are discoverable via the MCP server interface.
