// Save this as: src/components/modals/TalkToExpertModal.jsx

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import {
  X,
  Send,
  User,
  Mail,
  Phone,
  Building,
  Loader2,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const TalkToExpertModal = ({ isOpen, onClose, service, allServices }) => {
  const [loading, setLoading] = useState(false);
  const ServiceIcon = service?.icon;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const form = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      company: '',
      service: service?.id || '',
      budget: '',
      timeline: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please log in to submit a service inquiry.');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to submit an inquiry');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/service-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send inquiry';
        try {
          const errorData = await response.text();
          if (errorData) {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.message || errorMessage;
          }
        } catch {
          errorMessage = `Request failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      toast.success('Your inquiry has been sent successfully! We\'ll get back to you soon.');
      form.reset();
      onClose();
    } catch (error) {
      console.error('Inquiry submission error:', error);
      toast.error(error.message || 'Failed to send your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all hover:scale-110 text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[95vh] custom-scrollbar">
          {/* Hero Section with Image */}
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
            {/* Background Image with Overlay */}
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
              alt="Professional consultation"
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            
            {/* Content Over Image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  {ServiceIcon && <ServiceIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
                </div>
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-primary-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-center mb-2">
                Talk to an Expert
              </h2>
              <p className="text-sm sm:text-base text-primary-100 text-center max-w-md">
                Get a free consultation for {service.title}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Benefits Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { icon: CheckCircle, text: "Free Consultation" },
                { icon: CheckCircle, text: "Expert Advice" },
                { icon: CheckCircle, text: "24hr Response" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800"
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-primary-900 dark:text-primary-100">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Full Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10 h-10 sm:h-11" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              className="pl-10 h-10 sm:h-11" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone and Company Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              placeholder="+234 XXX XXX XXXX" 
                              className="pl-10 h-10 sm:h-11" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Company Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                              placeholder="Your company" 
                              className="pl-10 h-10 sm:h-11" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service Selection - Full Width */}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Service of Interest *</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {allServices.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Budget and Timeline Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Budget Range</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select budget range</option>
                            <option value="under-50k">Under ₦50,000</option>
                            <option value="50k-150k">₦50,000 - ₦150,000</option>
                            <option value="150k-300k">₦150,000 - ₦300,000</option>
                            <option value="300k-500k">₦300,000 - ₦500,000</option>
                            <option value="over-500k">Over ₦500,000</option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Project Timeline</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select timeline</option>
                            <option value="asap">ASAP</option>
                            <option value="1-month">Within 1 month</option>
                            <option value="2-3-months">2-3 months</option>
                            <option value="3-6-months">3-6 months</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message - Full Width */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Project Details *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project, goals, and any specific requirements..."
                          rows={4}
                          className="resize-none text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </>
                  )}
                </Button>

                {/* Footer Note */}
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting this form, you agree to our terms and privacy policy. 
                  We typically respond within 24 hours.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default TalkToExpertModal;