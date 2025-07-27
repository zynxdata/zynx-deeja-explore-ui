
import SecurityDashboard from '@/components/security/SecurityDashboard';
import RoleGuard from '@/components/auth/RoleGuard';

const Security = () => {
  return (
    <RoleGuard requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <SecurityDashboard />
      </div>
    </RoleGuard>
  );
};

export default Security;
