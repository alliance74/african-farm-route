import { useCurrentUser } from "@/hooks/useCurrentUser";

const Profile = () => {
  const user = useCurrentUser();
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Profile</h2>
      <div><strong>Name:</strong> {user.full_name || 'N/A'}</div>
      <div><strong>Phone:</strong> {user.phone}</div>
      <div><strong>Email:</strong> {user.email || 'N/A'}</div>
      <div><strong>Role:</strong> {user.user_type}</div>
    </div>
  );
};

export default Profile; 