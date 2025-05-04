import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/api';
import { endpoints } from '@/lib/api';
import { authService } from '@/lib/api/services';
import { toast } from '@/components/ui/sonner';

/**
 * Example component demonstrating how to use the API service
 */
const ApiExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Example of using the generic apiService
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Example GET request
      const response = await apiService.get(endpoints.PROPERTY.LIST);
      setData(response);
      toast.success('Data fetched successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      // Error handling is already done in the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  // Example of using a specific service
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Example of using the authService
      const loginData = {
        email: 'example@example.com',
        password: 'password123',
      };
      
      const response = await authService.login(loginData);
      setData(response);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      // Error handling is already done in the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  // Example of a POST request
  const createItem = async () => {
    setIsLoading(true);
    try {
      const newItem = {
        title: 'New Property',
        description: 'A beautiful property',
        price: 1000,
      };
      
      const response = await apiService.post(endpoints.PROPERTY.CREATE, newItem);
      setData(response);
      toast.success('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      // Error handling is already done in the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Example</CardTitle>
        <CardDescription>
          Examples of using the API service with Axios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={fetchData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch Data (GET)'}
          </Button>
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login Example'}
          </Button>
        </div>
        <Button onClick={createItem} disabled={isLoading} className="w-full">
          {isLoading ? 'Loading...' : 'Create Item (POST)'}
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
        This is an example component showing how to use the API service.
      </CardFooter>
    </Card>
  );
};

export default ApiExample;
