import React, { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";
import { Sidebar } from "../layouts/Sidebar";
import { Breadcrumb } from "../layouts/Breadcrumb";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

interface SettingsProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

interface Business {
  id: number;
  name: string;
  tagline: string;
  industry: string;
  description: string;
  logo?: string;
  contact_info: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export const Settings: React.FC<SettingsProps> = ({ businessId, onNavigate }) => {
  const { accessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    industry: "",
    description: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  // Fetch business and contact info
  useEffect(() => {
    const fetchBusiness = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/businesses/${businessId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!res.ok) {
          console.error("Error fetching business:", await res.text());
          return;
        }
        const data = await res.json();
        setBusiness(data);
        setFormData({
          name: data.name || "",
          tagline: data.tagline || "",
          industry: data.industry || "",
          description: data.description || "",
          logo: data.logo || "",
          email: data.contact_info?.email || "",
          phone: data.contact_info?.phone || "",
          address: data.contact_info?.address || "",
          city: data.contact_info?.city || "",
          state: data.contact_info?.state || "",
          postal_code: data.contact_info?.postal_code || "",
          country: data.contact_info?.country || "",
        });
      } catch (err) {
        console.error("Error fetching business:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [businessId, accessToken]);

  // Update business + contact info
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !accessToken) return;

    const payload = {
      name: formData.name,
      tagline: formData.tagline,
      industry: formData.industry,
      description: formData.description,
      contact_info: {
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
      },
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/businesses/${businessId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        console.error("Update error:", await res.text());
        throw new Error("Failed to update business info");
      }
      const updated = await res.json();
      setBusiness(updated);
      alert("Business updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating business info");
    }
  };

  // Upload logo
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !business || !accessToken) return;
    const file = e.target.files[0];

    const formDataToSend = new FormData();
    formDataToSend.append("logo", file);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("tagline", formData.tagline);
    formDataToSend.append("industry", formData.industry);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("contact_info[email]", formData.email);
    formDataToSend.append("contact_info[phone]", formData.phone);
    formDataToSend.append("contact_info[address]", formData.address);
    formDataToSend.append("contact_info[city]", formData.city);
    formDataToSend.append("contact_info[state]", formData.state);
    formDataToSend.append("contact_info[postal_code]", formData.postal_code);
    formDataToSend.append("contact_info[country]", formData.country);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/businesses/${businessId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataToSend,
        }
      );
      if (!res.ok) {
        console.error("Logo update error:", await res.text());
        throw new Error("Failed to update logo");
      }
      const updated = await res.json();
      setBusiness(updated);
      setFormData({ ...formData, logo: updated.logo || "" });
      alert("Logo updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating logo");
    }
  };

  // Delete business
  const handleDelete = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/businesses/${businessId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        console.error("Delete error:", await res.text());
        throw new Error("Failed to delete business");
      }
      setShowDeleteModal(false);
      onNavigate("/businesses");
    } catch (err) {
      console.error("Error deleting business:", err);
    }
  };

  if (loading || !business) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={`/business/${businessId}/settings`}
        onNavigate={onNavigate}
        businessId={businessId}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-8`}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Businesses", path: "/businesses" },
              { label: business.name, path: `/business/${businessId}` },
              { label: "Settings" },
            ]}
            onNavigate={onNavigate}
          />

          <h1 className="text-3xl font-bold mt-4" style={{ color: 'var(--text)' }}>
            Business Settings
          </h1>

          {/* Business Info */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>
              Business Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-5xl">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="logo"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    "Logo"
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Business Logo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>

              <Input
                label="Business Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                label="Tagline"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
              />

              <Input
                label="Industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none"
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--secondary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <Button variant="primary" icon={<Save size={20} />} type="submit">
                Save Changes
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Contact Information
              </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <Input
                  label="State/Province"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      postal_code: e.target.value,
                    })
                  }
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>

              <Button variant="primary" icon={<Save size={20} />} type="submit">
                Save Contact Info
              </Button>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="mb-6" style={{ background: 'rgba(239,83,80,0.05)', border: '2px solid rgba(239,83,80,0.2)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--error)' }}>
              Danger Zone
            </h2>
            <p className="mb-4" style={{ color: 'var(--muted)' }}>
              Once you delete a business, there is no going back. Please be
              certain.
            </p>
            <Button
              variant="error"
              icon={<Trash2 size={20} />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Business
            </Button>
          </Card>

          {/* Delete Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Business"
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{business.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="error"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};
