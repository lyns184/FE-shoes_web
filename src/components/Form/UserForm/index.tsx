import { useState, useEffect } from 'react';

export type UserFormData = {
  avatar?: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'Admin' | 'Customer';
};

type UserFormProps = {
  mode?: 'create' | 'edit';
  title?: string;
  description?: string;
  initialValues?: Partial<UserFormData>;
  onCancel: () => void;
  onSubmit: (data: UserFormData) => void;
};

const UserForm = ({
  mode = 'create',
  title = 'Add New User',
  description = 'Create a new user',
  initialValues,
  onCancel,
  onSubmit,
}: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: initialValues?.fullName || '',
    phone: initialValues?.phone || '',
    email: initialValues?.email || '',
    role: initialValues?.role || 'Customer',
    avatar: initialValues?.avatar,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialValues?.avatar);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        fullName: initialValues.fullName || '',
        phone: initialValues.phone || '',
        email: initialValues.email || '',
        role: initialValues.role || 'Customer',
        avatar: initialValues.avatar,
      });
      setAvatarPreview(initialValues.avatar);
    }
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-6 right-6 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-neutral-900 mb-2">{title}</h2>
          <p className="text-neutral-500 text-base mb-8">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div>
              <label className="text-neutral-900 font-bold text-lg block mb-4">Avatar</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl border-2 border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-neutral-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="border-2 border-neutral-300 rounded-2xl px-6 py-4 text-center font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                    Choose File
                  </div>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-neutral-900 font-bold text-lg block mb-3">Full name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className="w-full border-2 border-neutral-300 rounded-2xl px-4 py-4 text-base placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-neutral-900 font-bold text-lg block mb-3">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="w-full border-2 border-neutral-300 rounded-2xl px-4 py-4 text-base placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-neutral-900 font-bold text-lg block mb-3">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email Address"
                className="w-full border-2 border-neutral-300 rounded-2xl px-4 py-4 text-base placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-neutral-900 font-bold text-lg block mb-3">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border-2 border-neutral-300 rounded-2xl px-4 py-4 pr-12 text-base bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="">Select Role</option>
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  width="13"
                  height="8"
                  viewBox="0 0 13 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1.02344 1.02344L6.1414 6.1414L11.2594 1.02344" stroke="#1E1E1E" strokeWidth="2.04719" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border-2 border-neutral-800 text-neutral-800 font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-[#396254] text-white font-semibold rounded-xl hover:bg-[#2f4f45] transition-colors cursor-pointer"
              >
                {mode === 'edit' ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;