import { useState, useCallback } from "react";

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseJson, setResponseJson] = useState("");

  function resetError() {
    setError(null);
  }
  function resetResponseJson() {
    setResponseJson("");
  }

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error(requestConfig.errorMsg);
      }

      const data = await response.json();
      setResponseJson(data);

      if (data.responseCode === 1) {
        throw new Error(data.responseMessage);
      }
    } catch (err) {
      setError(err.message || requestConfig.errorMsg);
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading: isLoading,
    error: error,
    response: responseJson,
    sendRequest: sendRequest,
    resetError: resetError,
    resetResponse: resetResponseJson,
  };
}
export default useHttp;
