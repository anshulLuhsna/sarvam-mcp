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
