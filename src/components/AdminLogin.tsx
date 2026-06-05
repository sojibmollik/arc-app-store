'use client';

import React, { useState, useTransition } from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';
import { loginAdmin } from '@/lib/actions/admin';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const AdminLogin: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    startTransition(async () => {
      const result = await loginAdmin(null, formData);
      if (result && !result.success) {
        setErrorMsg(result.message);
      }
    });
  };

  return (
    <div className="max-w-md w-full mx-auto py-12 relative z-10">
      <Card className="border border-brand-border/60">
        <CardHeader className="text-center p-8">
          <div className="mx-auto p-3 rounded-xl bg-brand-violet/10 text-brand-cyan border border-brand-violet/20 w-fit mb-4">
            <Cpu className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-extrabold tracking-tight">Admin Console</CardTitle>
          <CardDescription>
            Enter your credentials to manage applications and submissions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 border-t border-brand-border/40 bg-brand-dark/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-brand-pink/10 border border-brand-pink/25 text-brand-pink text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <Input
              label="Admin Email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              disabled={isPending}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isPending}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
