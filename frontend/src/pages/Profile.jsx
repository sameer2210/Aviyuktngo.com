import { useEffect, useMemo, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import SkeletonImage from '../Components/SkeletonImage';
import { RouteLoadingState } from '../Components/LoadingStates';

const Profile = () => {
  const { user, logout, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const transactions = [];

  const createFallbackAvatar = (fullName, email) => {
    const initials =
      (fullName || email || 'AV')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('') || 'AV';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#335288" />
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="110" font-family="Arial, sans-serif" font-weight="700">${initials}</text>
      </svg>
    `;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const normalizeProfileImage = rawLink => {
    if (!rawLink || typeof rawLink !== 'string') return '';

    let imageUrl = rawLink.trim();
    if (!imageUrl) return '';

    if (imageUrl.startsWith('http://')) {
      imageUrl = imageUrl.replace(/^http:\/\//i, 'https://');
    }

    // Improve quality for Google profile photos.
    if (/googleusercontent\.com/i.test(imageUrl)) {
      imageUrl = imageUrl.replace(/=s\d+(-c)?$/i, '=s400-c').replace(/s96-c/gi, 's400-c');

      // Ensure there is at least size 400 for better quality, preserve extras.
      try {
        const parsedUrl = new URL(imageUrl);
        const size = Number(parsedUrl.searchParams.get('sz'));
        if (!size || size < 400) {
          parsedUrl.searchParams.set('sz', '400');
        }
        imageUrl = parsedUrl.toString();
      } catch {
        // ignore parse failure
      }
    }

    return imageUrl;
  };

  const fallbackAvatar = useMemo(
    () => createFallbackAvatar(user?.name, user?.email),
    [user?.name, user?.email]
  );

  const imageCandidates = useMemo(() => {
    return [user?.profilePic].map(normalizeProfileImage).filter(Boolean);
  }, [user]);

  const [profileImage, setProfileImage] = useState(fallbackAvatar);

  useEffect(() => {
    setProfileImage(imageCandidates[0] || fallbackAvatar);
    console.log('Profile image candidates:', imageCandidates);
  }, [imageCandidates, fallbackAvatar]);

  const handleImageError = () => {
    setProfileImage(current => {
      const currentIndex = imageCandidates.indexOf(current);
      if (currentIndex >= 0 && currentIndex < imageCandidates.length - 1) {
        return imageCandidates[currentIndex + 1];
      }
      return fallbackAvatar;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isAuthLoading) {
    return <RouteLoadingState label="Loading profile" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 md:p-10">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="p-6 md:p-8 bg-gradient-to-r from-blue-100 to-indigo-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-3xl font-bold text-[#335288]">My Profile</h2>
            <Link to="/" className="text-[#335288] hover:underline text-sm md:text-base">
              ← Back to Home
            </Link>
          </div>
        </div>

        {user ? (
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[170px_1fr] gap-6 items-center">
              <div className="flex justify-center lg:justify-start">
                <SkeletonImage
                  src={profileImage}
                  alt={user?.name ? `${user.name} profile` : 'Profile'}
                  onError={handleImageError}
                  loading="lazy"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xl font-semibold text-[#1f436a]">{user.name || 'N/A'}</p>
                <p className="text-gray-600 text-sm md:text-base">{user.email}</p>
                <div className="mt-4 space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Joined:</span>{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span> {user.role || 'Donor'}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {user.status || 'Active'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#335288] mb-3">Donation History</h3>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#335288] text-white">
                      <tr>
                        <th className="px-4 py-2 text-sm">Date</th>
                        <th className="px-4 py-2 text-sm">Cause</th>
                        <th className="px-4 py-2 text-sm">Amount</th>
                        <th className="px-4 py-2 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-4 py-2 text-sm">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm">{tx.cause}</td>
                          <td className="px-4 py-2 text-sm">₹{tx.amount}</td>
                          <td className="px-4 py-2 text-sm">{tx.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No donations yet.</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <button
                onClick={handleLogout}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#335288] hover:bg-transparent hover:text-[#335288] text-white font-semibold border border-[#335288] py-2 px-6 rounded-md transition-all"
              >
                <FiLogOut className="h-5 w-5" />
                Logout
              </button>
              <Link
                to="/payhistory"
                className="w-full md:w-auto text-center text-[#335288] border border-[#335288] px-4 py-2 rounded hover:bg-[#335288] hover:text-white transition-colors duration-200 text-sm md:text-base"
              >
                Payment <span className="font-bold">History</span>
              </Link>
            </div>
          </div>
        ) : (
          <p className="p-6 text-gray-500">No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

