const handleApiErrors = (error) => {
    
    let userMessage = 'Currency service unavailable';
    let systemMessage = error.message;
    let statusCode = null;
  
    if (error.response) {
      statusCode = error.response.status;
      systemMessage = `API Error: ${statusCode} - ${JSON.stringify(error.response.data)}`;
      
      if (statusCode === 429) {
        userMessage = 'Too many requests. Please try again later.';
      } else if (statusCode >= 500) {
        userMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      systemMessage = 'No response from server';
      userMessage = 'Network error. Please check your connection.';
    }
  
    console.error('API Error:', {
      systemMessage,
      statusCode,
      originalError: error
    });
  
    return {
      userMessage,
      systemMessage,
      statusCode
    };
  };
  
  export default handleApiErrors;