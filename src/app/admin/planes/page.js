'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Image from 'next/image';
import AdminHeader from '../components/AdminHeader';

export default function AdminPlanesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planes, setPlanes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: '',
    description: '',
    features: [''],
    benefits: [''],
    popular: false,
    icon: '',
    color: '',
    order: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadPlanes();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadPlanes = async () => {
    try {
      const planesCol = collection(db, 'planes');
      const planesSnapshot = await getDocs(planesCol);
      const planesList = planesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlanes(planesList);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
      const cleanedBenefits = formData.benefits.filter(f => f.trim() !== '');
      
      if (editingPlan) {
        const planRef = doc(db, 'planes', editingPlan.id);
        await updateDoc(planRef, {
          ...formData,
          price: parseFloat(formData.price),
          order: parseInt(formData.order) || 0,
          features: cleanedFeatures,
          benefits: cleanedBenefits,
        });
      } else {
        await addDoc(collection(db, 'planes'), {
          ...formData,
          price: parseFloat(formData.price),
          order: parseInt(formData.order) || 0,
          features: cleanedFeatures,
          benefits: cleanedBenefits,
          createdAt: new Date(),
        });
      }
      setShowModal(false);
      setEditingPlan(null);
      resetForm();
      loadPlanes();
    } catch (error) {
      console.error('Error al guardar plan:', error);
      alert('Error al guardar el plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      price: plan.price?.toString() || '',
      period: plan.period || '',
      description: plan.description || '',
      features: (Array.isArray(plan.features) && plan.features.length > 0) ? plan.features : [''],
      benefits: (Array.isArray(plan.benefits) && plan.benefits.length > 0) ? plan.benefits : [''],
      icon: plan.icon || '',
      color: plan.color || '',
      order: plan.order || 0,
      popular: plan.popular === true, // Asegurar que sea siempre boolean
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este plan?')) {
      try {
        await deleteDoc(doc(db, 'planes', id));
        loadPlanes();
      } catch (error) {
        console.error('Error al eliminar plan:', error);
        alert('Error al eliminar el plan');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      period: '',
      description: '',
      features: [''],
      benefits: [''],
      icon: '',
      color: '',
      order: 0,
      popular: false,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ''],
    });
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-avc-red mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader 
        title="Planes y Membresías"
        subtitle="Gestiona los planes de membresía y sus precios"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrar Planes y Membresías</h2>
          <p className="text-gray-600">Gestiona los planes de suscripción, precios y beneficios</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-100 hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>
          <button
            onClick={() => {
              setEditingPlan(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-avc-red hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-avc-red transition-all duration-300 relative">
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-avc-red text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-avc-red">${plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <ul className="space-y-2 mb-6">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {planes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">No hay planes registrados</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-avc-red hover:bg-red-700 text-gray-900 font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              Crear Primer Plan
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPlan(null);
                  resetForm();
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Plan</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="CrossFit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="$850"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                    placeholder="/mes, 12 clases, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                  placeholder="Acceso ilimitado a clases..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Características</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-avc-red hover:text-red-500 text-sm font-semibold"
                  >
                    + Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                        placeholder="Clases ilimitadas"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="bg-red-600 hover:bg-red-700 text-gray-900 p-2 rounded-lg transition duration-300"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Beneficios</label>
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-avc-red hover:text-red-500 text-sm font-semibold"
                  >
                    + Agregar beneficio
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-avc-red"
                        placeholder="Asesoría nutricional"
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="bg-red-600 hover:bg-red-700 text-gray-900 p-2 rounded-lg transition duration-300"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-5 h-5 text-avc-red bg-gray-100 border-gray-300 rounded focus:ring-avc-red"
                  />
                  <span className="text-gray-700">Marcar como plan popular</span>
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPlan(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-avc-red hover:bg-red-700 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                  {editingPlan ? 'Actualizar' : 'Crear'} Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
