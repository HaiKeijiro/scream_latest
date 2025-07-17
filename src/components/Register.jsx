import { useState } from "react";

export default function Register({ setCurrentPage, userData, setUserData }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserData((prev) => ({ ...prev, name: value }));

    // Clear error when user starts typing
    if (errors.name && value.trim()) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setUserData((prev) => ({ ...prev, phone: value }));

    // Clear error when user starts typing
    if (errors.phone && value.trim()) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!userData.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (userData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (userData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    // Phone validation
    if (!userData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(userData.phone.trim())) {
      newErrors.phone = "Phone must be 10-15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate async processing (you could add actual validation here)
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPage((prevState) => prevState + 1);
    }, 500);
  };

  return (
    <div className="bg-image georgia-font h-screen w-full flex flex-col items-center justify-center px-6">
      {/* Header Section */}
      <div className="mb-8">
        <img src="/indomart.png" alt="indomart" className="mx-auto mb-8" />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-[4em] md:text-[6em] font-black mb-8 main-color uppercase">
          register
        </h1>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="text-left">
            <label
              htmlFor="name"
              className="block text-[1.5em] font-bold mb-4 main-color uppercase"
            >
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={userData.name}
              onChange={handleNameChange}
              className={`w-full h-[80px] text-[1.3em] px-6 rounded-2xl border-4 transition-all duration-300 georgia-font font-semibold ${
                errors.name
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:bg-red-100"
                  : "border-[#0F61A5] bg-white/90 focus:border-[#0F61A5] focus:bg-white focus:scale-105"
              } focus:outline-none shadow-lg focus:shadow-xl`}
              placeholder="Enter your awesome name..."
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-[1.1em] font-bold mt-3 animate-pulse">
                ⚠️ {errors.name}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="text-left">
            <label
              htmlFor="phone"
              className="block text-[1.5em] font-bold mb-4 main-color uppercase"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={userData.phone}
              onChange={handlePhoneChange}
              className={`w-full h-[80px] text-[1.3em] px-6 rounded-2xl border-4 transition-all duration-300 georgia-font font-semibold ${
                errors.phone
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:bg-red-100"
                  : "border-[#0F61A5] bg-white/90 focus:border-[#0F61A5] focus:bg-white focus:scale-105"
              } focus:outline-none shadow-lg focus:shadow-xl`}
              placeholder="Your phone number..."
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-[1.1em] font-bold mt-3 animate-pulse">
                ⚠️ {errors.phone}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting || !userData.name?.trim() || !userData.phone?.trim()
            }
            className={`w-full rounded-full px-16 py-6 text-[1.5em] font-black transition-all duration-300 transform text-white uppercase shadow-lg ${
              isSubmitting || !userData.name?.trim() || !userData.phone?.trim()
                ? "bg-gray-400 cursor-not-allowed scale-95 opacity-60"
                : "bg-[#0F61A5] hover:bg-blue-700 hover:scale-110 active:scale-95 hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                preparing...
              </div>
            ) : (
              "🎤 let's scream! 🎤"
            )}
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <div className="mt-16">
        <img src="/festival.png" alt="festival" className="mx-auto" />
      </div>
    </div>
  );
}
