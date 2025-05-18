import { jest } from '@jest/globals';

const fetch = jest.fn();

// You might need to mock FormData if your code uses it from node-fetch
// For now, we assume FormData is imported from 'form-data' package separately
// class FormDataMock {
//   constructor() { this.data = {}; }
//   append(key, value) { this.data[key] = value; }
//   getHeaders() { return { 'content-type': 'multipart/form-data; boundary=---jest' }; }
// }

export default fetch;
// export { FormDataMock as FormData }; // Uncomment if FormData from node-fetch is used by tools 