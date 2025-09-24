'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaStar } from 'react-icons/fa';

export default function CustomerReviewForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState(null);


  const CustomerSchema = Yup.object().shape({
    name: Yup.string().required('Customer name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  });

  const ReviewSchema = Yup.object().shape({
    productName: Yup.string().required('Product Name is required'),
    quantity: Yup.string().required('Quantity is required'),
    favoriteFlavor: Yup.string().required('Favorite Flavor is required'),
    feedback: Yup.string().required('Feedback is required'),
    rating: Yup.number().min(1).max(5).required('Rating is required'),
    customerId: Yup.string().required('Customer Id is required'),
  });

  const handleCustomerSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {

      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:values.email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setFieldError('general','User already exists.');
        return;
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create customer');
      setCustomerId(data.user.id);
      setStep(2);
    } catch (err) {
      setFieldError('general', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit review');
      router.push('/view-customers');
    } catch (err) {
      setFieldError('general', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full max-w-sm p-2 border border-gray-300 rounded';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Step 1: Create Customer */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-6 flex items-center justify-center md:justify-start">
              <FaUser className="mr-2" /> Create Customer
            </h1>
            <Formik
              initialValues={{ name: '', email: '', password: '' }}
              validationSchema={CustomerSchema}
              onSubmit={handleCustomerSubmit}
            >
              {({ isSubmitting, errors }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {errors.general && (
                    <div className="col-span-full bg-red-100 text-red-700 p-2 rounded">{errors.general}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Field name="name" placeholder="Customer Name" className={inputClass} />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Field type="email" name="email" placeholder="Email" className={inputClass} />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Field name="password" placeholder="Password" className={inputClass} />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="md:col-span-2 flex justify-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Customer'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}

        {/* Step 2: Submit Review */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold mb-6 flex items-center justify-center md:justify-start">
              <FaUser className="mr-2" /> Submit Review
            </h1>
            <Formik
              initialValues={{
                productName: '',
                quantity: '',
                favoriteFlavor: '',
                feedback: '',
                rating: 5,
                customerId:customerId
              }}
              validationSchema={ReviewSchema}
              onSubmit={handleReviewSubmit}
            >
              {({ isSubmitting, values, setFieldValue, errors }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {errors.general && (
                    <div className="col-span-full bg-red-100 text-red-700 p-2 rounded">{errors.general}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <Field name="productName" placeholder="Product Name" className={inputClass} />
                    <ErrorMessage name="productName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <Field name="quantity" placeholder="Quantity" className={inputClass} />
                    <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Favorite Flavor</label>
                    <Field as="select" name="favoriteFlavor" className={inputClass}>
                      <option value="">-- Select a Flavor --</option>
                      <option value="Spicy Chili">Spicy Chili</option>
                      <option value="Classic Cheese">Classic Cheese</option>
                      <option value="Sour Cream & Onion">Sour Cream & Onion</option>
                      <option value="Sea Salt Caramel">Sea Salt Caramel</option>
                    </Field>
                    <ErrorMessage name="favoriteFlavor" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Feedback</label>
                    <Field as="textarea" name="feedback" rows="4" placeholder="Write your feedback" className={inputClass} />
                    <ErrorMessage name="feedback" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2 flex-wrap">
                    <label className="block text-sm font-medium text-gray-700 mr-2">Rating</label>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer ${values.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setFieldValue('rating', star)}
                      />
                    ))}
                  </div>

                  <div className="md:col-span-2 flex justify-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
}
