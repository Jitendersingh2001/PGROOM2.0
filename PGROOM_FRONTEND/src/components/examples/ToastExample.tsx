import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

/**
 * Example component demonstrating different toast types
 */
const ToastExample = () => {
  const showSuccessToast = () => {
    toast.success('This is a success message');
  };

  const showErrorToast = () => {
    toast.error('This is an error message');
  };

  const showInfoToast = () => {
    toast.info('This is an info message');
  };

  const showWarningToast = () => {
    toast.warning('This is a warning message');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Toast Examples</CardTitle>
        <CardDescription>
          Examples of different toast notification styles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={showSuccessToast} variant="default">
            Success Toast
          </Button>
          <Button onClick={showErrorToast} variant="destructive">
            Error Toast
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={showInfoToast} variant="outline">
            Info Toast
          </Button>
          <Button onClick={showWarningToast} variant="secondary">
            Warning Toast
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Click the buttons to see different toast notification styles
      </CardFooter>
    </Card>
  );
};

export default ToastExample;
