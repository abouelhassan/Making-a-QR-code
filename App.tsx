
import React, { useState } from 'react';
import InputField from './components/InputField';
import QRCodeDisplay from './components/QRCodeDisplay';
import type { UserData } from './types';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <main className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="md:grid md:grid-cols-2">
            
            {/* Form Section */}
            <div className="p-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">مولد رمز QR للملف الشخصي</h1>
                <p className="text-slate-500 mt-2">
                  أدخل بياناتك الشخصية في الحقول أدناه لإنشاء رمز QR الخاص بك بشكل فوري.
                </p>
              </header>
              <form onSubmit={(e) => e.preventDefault()}>
                <InputField
                  id="fullName"
                  label="الاسم الكامل"
                  value={userData.fullName}
                  onChange={handleChange}
                  placeholder="مثال: أحمد عبدالله"
                />
                <InputField
                  id="email"
                  label="البريد الإلكتروني"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                <InputField
                  id="phone"
                  label="رقم الموبايل"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="+966501234567"
                />
                <InputField
                  id="bio"
                  label="نبذة تعريفية قصيرة"
                  as="textarea"
                  value={userData.bio}
                  onChange={handleChange}
                  placeholder="مطور واجهات أمامية متخصص في React..."
                />
              </form>
            </div>

            {/* QR Code Display Section */}
            <div className="bg-slate-50">
              <QRCodeDisplay userData={userData} />
            </div>

          </div>
        </div>
        <footer className="text-center mt-6 text-sm text-slate-500">
          <p>تم التصميم والتطوير بواسطة مهندس واجهات أمامية خبير.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
