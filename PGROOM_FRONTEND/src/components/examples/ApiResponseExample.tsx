import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { endpoints } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { ApiResponse, isApiSuccessResponse, isApiValidationErrorResponse, isApiServerErrorResponse } from '@/lib/types/api';
import { useApiResponse } from '@/hooks/useApiResponse';

/**
 * Example component demonstrating how to use the API service with the new response format
 */
const ApiResponseExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { handleSuccess, handleError } = useApiResponse();

  // Example of using the generic apiService with the new response format
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Example GET request
      const response = await apiService.get(endpoints.PROPERTY.LIST);
      
      // Handle success response
      if (isApiSuccessResponse(response)) {
        setData(response.data);
        toast.success('Data fetched successfully!');
      } else {
        // Handle error response
        handleError(response);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example of a POST request with validation error handling
  const createItem = async () => {
    setIsLoading(true);
    try {
      const newItem = {
        title: 'New Property',
        description: 'A beautiful property',
        price: 1000,
      };
      
      const response = await apiService.post(endpoints.PROPERTY.CREATE, newItem);
      
      // Using the handleSuccess utility from useApiResponse
      const data = handleSuccess(response, 'Item created successfully!');
      setData(data);
    } catch (error) {
      // Using the handleError utility from useApiResponse
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example of manually handling different response types
  const handleDifferentResponses = async () => {
    setIsLoading(true);
    try {
      // Example request that could return different response types
      const response = await apiService.get(endpoints.PROPERTY.LIST);
      
      // Handle different response types
      if (isApiSuccessResponse(response)) {
        // Handle success response (statusCode: 200)
        setData(response.data);
        toast.success(`Success: ${response.message}`);
      } else if (isApiValidationErrorResponse(response)) {
        // Handle validation error (statusCode: 422)
        toast.error(`Validation Error: ${response.message}`);
      } else if (isApiServerErrorResponse(response)) {
        // Handle server error (statusCode: 500)
        toast.error(`Server Error: ${response.message}`);
      } else {
        // Handle unknown response type
        toast.error('Unknown response type');
      }
    } catch (error) {
      // Handle errors thrown by axios or other sources
      if (error && typeof error === 'object' && 'statusCode' in error) {
        // It's an API error response
        const apiError = error as ApiResponse;
        toast.error(`API Error: ${apiError.message}`);
      } else if (error instanceof Error) {
        // It's a standard JS error
        toast.error(`Error: ${error.message}`);
      } else {
        // Unknown error type
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Response Example</CardTitle>
        <CardDescription>
          Examples of handling different API response formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={fetchData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch Data (GET)'}
          </Button>
          <Button onClick={createItem} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Create Item (POST)'}
          </Button>
        </div>
        <Button onClick={handleDifferentResponses} disabled={isLoading} className="w-full">
          {isLoading ? 'Loading...' : 'Handle Different Responses'}
        </Button>

        {data && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Response Data:</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        This example demonstrates how to handle the three API response formats:
        <ul className="list-disc pl-5 mt-2">
          <li>Success (statusCode: 200)</li>
          <li>Validation Error (statusCode: 422)</li>
          <li>Server Error (statusCode: 500)</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default ApiResponseExample;
