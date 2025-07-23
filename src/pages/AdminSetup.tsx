
import React from 'react';
import CreateOwnerUser from '@/components/admin/CreateOwnerUser';

const AdminSetup = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground mt-2">
            Set up the initial owner account for Zynx CaaS
          </p>
        </div>
        
        <CreateOwnerUser />
      </div>
    </div>
  );
};

export default AdminSetup;
