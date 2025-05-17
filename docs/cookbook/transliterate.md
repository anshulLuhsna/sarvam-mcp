---
title: 'Transliteration API: A Hands-on Guide'
description: >-
  Learn how to use the Transliteration API to convert text from one script to
  another while preserving pronunciation
---

# Overview

This tutorial demonstrates how to use the **Transliteration API** to convert text from one script to another while preserving pronunciation. It supports multiple Indic languages and offers customizable numeral formatting.

## Table of Contents

1. [Setup & Installation](#1-setup--installation)
2. [Authentication](#2-authentication)
3. [Understanding the Parameters](#3-understanding-the-parameters)
4. [Basic Usage](#4-basic-usage)
5. [Experimenting with Different Options](#5-experimenting-with-different-options)
6. [Advanced Features](#6-advance-features)
7. [Error Handling](#7-error-handling)
8. [Additional Resources](#8-additional-resources)
9. [Final Notes](#9-final-notes)

## 1. Setup & Installation

Before you begin, ensure you have the necessary Python libraries installed. Run the following commands to install the required packages:

```python
pip install requests
```

```python
import requests
```

## 2. Authentication

To use the API, you need an API subscription key. Follow these steps to set up your API key:

1. **Obtain your API key**: If you don't have an API key, sign up on the [Sarvam AI Dashboard](https://dashboard.sarvam.ai/) to get one.
2. **Replace the placeholder key**: In the code below, replace "YOUR_SARVAM_AI_API_KEY" with your actual API key.

```python
SARVAM_API_KEY = "YOUR_SARVAM_API_KEY"
```

## 3. Understanding the Parameters

The API takes several key parameters:

- **`input`** – The text to be transliterated.
- **`source_language_code`** – Language of the input text.
- **`target_language_code`** – Desired transliteration output language.
- **`numerals_format`** – Choose between **international (0-9)** or **native (१-९)** numbers.
- **`spoken_form`** – Whether to convert text into a natural spoken format.
- **`spoken_form_numerals_language`** – Choose whether numbers should be spoken in **English** or **native** language.

Note: Transliteration between Indic languages (e.g., Hindi → Bengali) is not supported.

## 4. Basic Usage

### 4.1. Read the Document

We have two sample documents under the `data` folder:

- `sample1.txt` contains an essay on _The Impact of Artificial Intelligence on Society_ in English.
- `sample2.txt` contains an essay on _The Impact of Artificial Intelligence on Society_ in Hindi.

```python
def read_file(file_path, lang_name):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            # Read the first 5 lines
            lines = [next(file) for _ in range(5)]
            print(f"=== {lang_name} Text (First Few Lines) ===")
            print("".join(lines))  # Print first few lines

            # Read the remaining content
            remaining_text = file.read()

            # Combine all text
            full_doc = "".join(lines) + remaining_text

            # Count total characters
            total_chars = len(full_doc)
            print(f"\nTotal number of characters in {lang_name} file:", total_chars)

            return full_doc
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return None
    except Exception as e:
        print(f"An error occurred while reading {file_path}: {e}")
        return None
```

```python
# Read English and Hindi documents
english_doc = read_file("data/sample1.txt", "English")
hindi_doc = read_file("data/sample2.txt", "Hindi")
```

### 4.2. Split the text into chunks

Since the API has a restriction of 1000 characters per request, we need to split the text accordingly.

```python
def chunk_text(text, max_length=1000):
    """Splits text into chunks of at most max_length characters while preserving word boundaries."""
    chunks = []

    while len(text) > max_length:
        split_index = text.rfind(" ", 0, max_length)  # Find the last space within limit
        if split_index == -1:
            split_index = max_length  # No space found, force split at max_length

        chunks.append(text[:split_index].strip())  # Trim spaces before adding
        text = text[split_index:].lstrip()  # Remove leading spaces for the next chunk

    if text:
        chunks.append(text.strip())  # Add the last chunk

    return chunks
```

```python
# Split the text
english_text_chunks = chunk_text(english_doc)

# Display chunk info
print(f"Total Chunks: {len(english_text_chunks)}")
for i, chunk in enumerate(english_text_chunks[:3], 1):  # Show only first 3 chunks for preview
    print(f"\n=== Chunk {i} (Length: {len(chunk)}) ===\n{chunk}")
```

```python
# Split the text
hindi_text_chunks = chunk_text(english_doc)

# Display chunk info
print(f"Total Chunks: {len(hindi_text_chunks)}")
for i, chunk in enumerate(hindi_text_chunks[:3], 1):  # Show only first 3 chunks for preview
    print(f"\n=== Chunk {i} (Length: {len(chunk)}) ===\n{chunk}")
```

### 4.3. Setting up the API Endpoint

```python
import requests

# Define API request details
url = "https://api.sarvam.ai/transliterate"
headers = {
    "api-subscription-key": SARVAM_API_KEY,
    "Content-Type": "application/json"
}
```

```python
# Send requests for each chunk
translated_texts = []
for idx, chunk in enumerate(hindi_text_chunks):
    payload = {
        "input": chunk,
        "source_language_code": "hi-IN",
        "target_language_code": "hi-IN",
        "spoken_form": True,
        "numerals_format": "international"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        translated_text = response.json().get("transliterated_text", "Translation not available")
        translated_texts.append(translated_text)
        print(f"\n=== Translated Chunk {idx + 1} ===\n{translated_text}\n")
    else:
        print(f"Error: {response.status_code}, {response.text}")

# Combine all translated chunks
final_translation = "\n".join(translated_texts)
print("\n=== Final Translated Text ===")
print(final_translation)
```

## 5. Experimenting with Different Options

We currently have three different transliteration models:

### 5.1. Romanization (Indic → Latin Script)

- Converts Indic scripts to Roman script (English alphabet).
- Example: `मैं ऑफिस जा रहा हूँ` → `main office ja raha hun`
- Parameters:
  - `source_language_code = "hi-IN"`
  - `target_language_code = "en-IN"`

```python
# Define the payload for Romanization (Hindi to Latin script)
payload = {
    "input": "मैं ऑफिस जा रहा हूँ",
    "source_language_code": "hi-IN",
    "target_language_code": "en-IN",
    "spoken_form": True
}

# Send the request
response = requests.post(url, json=payload, headers=headers)

# Extract the transliterated text
if response.status_code == 200:
    transliterated_text = response.json().get("transliterated_text", "Translation not available")
    print("Romanized Text:", transliterated_text)
else:
    print(f"Error: {response.status_code}, {response.text}")
```

### 5.2. Conversion to Indic Scripts

- Converts text into an Indic script from various sources:

  - **Code-mixed text**

    - Example: `मैं office जा रहा हूँ` → `मैं ऑफिस जा रहा हूँ`
    - Parameters:
      - `source_language_code = "hi-IN"`
      - `target_language_code = "hi-IN"`

  - **Romanized text**

    - Example: `main office ja raha hun` → `मैं ऑफिस जा रहा हूँ`
    - Parameters:
      - `source_language_code = "hi-IN"`
      - `target_language_code = "hi-IN"`

  - **English text**
    - Example: `I am going to office` → `आइ ऍम गोइंग टू ऑफिस`
    - Parameters:
      - `source_language_code = "en-IN"`
      - `target_language_code = "hi-IN"`

```python
payload = {
    "input": "main office ja raha hun",
    "source_language_code": "hi-IN",
    "target_language_code": "hi-IN",
    "spoken_form": True
}

# Send the request
response = requests.post(url, json=payload, headers=headers)

# Extract the transliterated text
if response.status_code == 200:
    transliterated_text = response.json().get("transliterated_text", "Translation not available")
    print("Romanized Text:", transliterated_text)
else:
    print(f"Error: {response.status_code}, {response.text}")
```

### 5.3. Spoken Indic Form

- Converts written text into a more natural spoken form.
- Example: `मुझे कल 9:30am को appointment है` → `मुझे कल सुबह साढ़े नौ बजे अपॉइंटमेंट है`

```python
payload = {
    "input": "मुझे कल 9:30am को appointment है",
    "source_language_code": "hi-IN",
    "target_language_code": "hi-IN",
    "spoken_form": True,
}

# Send the request
response = requests.post(url, json=payload, headers=headers)

# Extract the transliterated text
if response.status_code == 200:
    transliterated_text = response.json().get("transliterated_text", "Translation not available")
    print("Romanized Text:", transliterated_text)
else:
    print(f"Error: {response.status_code}, {response.text}")
```

## 6. Advanced Features

- **`numerals_format`** – Choose between **international (0-9)** or **native (१-९)** numbers.
- **`spoken_form_numerals_language`** – Choose whether numbers should be spoken in **English** or the **native language**.

### 6.1. Numerals Format

`numerals_format` is an optional parameter with two options:

- **`international`** (default): Uses regular numerals (0-9).
- **`native`**: Uses language-specific native numerals.

#### Example:

- If `international` format is selected → `मेरा phone number है: 9840950950`.
- If `native` format is selected → `मेरा phone number है: ९८४०९५०९५०`.

```python
payload = {
    "input": "मुझे कल 9:30am को appointment है",
    "source_language_code": "hi-IN",
    "target_language_code": "hi-IN",
    "spoken_form": True,
    "numerals_format": "native"
}

# Send the request
response = requests.post(url, json=payload, headers=headers)

# Extract the transliterated text
if response.status_code == 200:
    transliterated_text = response.json().get("transliterated_text", "Translation not available")
    print("Romanized Text:", transliterated_text)
else:
    print(f"Error: {response.status_code}, {response.text}")
```

### 6.2. Spoken Form Numerals Language

`spoken_form_numerals_language` is an optional parameter with two options and only works when `spoken_form` is **true**:

- **`english`**: Numbers in the text will be spoken in **English**.
- **`native (default)`**: Numbers in the text will be spoken in the **native language**.

#### Example:

**Input:** `"मेरे पास ₹200 है"`

- If `english` format is selected → `"मेरे पास टू हन्डर्ड रूपीस है"`.
- If `native` format is selected → `"मेरे पास दो सौ रुपये है"`.

```python
payload = {
    "input": "मुझे कल 9:30am को appointment है",
    "source_language_code": "hi-IN",
    "target_language_code": "hi-IN",
    "spoken_form": True,
    "spoken_form_numerals_language": "english"
}

# Send the request
response = requests.post(url, json=payload, headers=headers)

# Extract the transliterated text
if response.status_code == 200:
    transliterated_text = response.json().get("transliterated_text", "Translation not available")
    print("Romanized Text:", transliterated_text)
else:
    print(f"Error: {response.status_code}, {response.text}")
```

## 7. Error Handling

You may encounter these errors while using the API:

- **403 Forbidden** (`invalid_api_key_error`)

  - Cause: Invalid API key.
  - Solution: Use a valid API key from the [Sarvam AI Dashboard](https://dashboard.sarvam.ai/).

- **429 Too Many Requests** (`insufficient_quota_error`)

  - Cause: Exceeded API quota.
  - Solution: Check your usage, upgrade if needed, or implement exponential backoff when retrying.

- **500 Internal Server Error** (`internal_server_error`)

  - Cause: Issue on our servers.
  - Solution: Try again later. If persistent, contact support.

- **400 Bad Request** (`invalid_request_error`)
  - Cause: Incorrect request formatting.
  - Solution: Verify your request structure and parameters.

## 8. Additional Resources

For more details, refer to our official documentation and we are always there to support and help you on our Discord Server:

- **Documentation**: [docs.sarvam.ai](https://docs.sarvam.ai)
- **Community**: [Join the Discord Community](https://discord.gg/hTuVuPNF)

## 9. Final Notes

- Keep your API key secure.
- Use clear audio for best results.
- Explore advanced features like diarization and translation.

**Keep Building!** 🚀
