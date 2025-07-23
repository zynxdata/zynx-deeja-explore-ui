
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const CreateOwnerUser = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createOwnerUser = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Create the owner user with a default password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'owner@zynx.com',
        password: 'ZynxOwner2024!',
        options: {
          data: {
            username: 'Z0000',
            full_name: 'Zynx Owner',
            role: 'owner'
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        setMessage(`Owner user created successfully! 
        Email: owner@zynx.com
        Username: Z0000
        User ID: ${data.user.id}
        
        Please check email for verification link.`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create owner user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Owner User</CardTitle>
        <CardDescription>
          Generate the owner user account (Z0000)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input value="Z0000" disabled />
        </div>
        
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value="owner@zynx.com" disabled />
        </div>

        <div className="space-y-2">
          <Label>Default Password</Label>
          <Input value="ZynxOwner2024!" type="password" disabled />
        </div>

        {message && (
          <Alert>
            <AlertDescription className="whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={createOwnerUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Owner User'}
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>Default credentials:</p>
          <p>Email: owner@zynx.com</p>
          <p>Password: ZynxOwner2024!</p>
          <p>Username: Z0000</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateOwnerUser;
