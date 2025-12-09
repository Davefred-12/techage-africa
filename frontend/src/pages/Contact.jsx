// ============================================
// FILE: src/pages/Contact.jsx
// ============================================
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import api from "../services/api";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/public/contact", data);

      if (response.data.success) {
        setIsSubmitted(true);
        reset();
        toast.success(
          "Message sent successfully! We'll respond within 24 hours."
        );

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "clinton@techageafrica.com",
      link: "mailto:clinton@techageafrica.com",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+234-XXX-XXX-XXXX",
      link: "tel:+234XXXXXXXXXX",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Lagos, Nigeria",
      link: null,
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Mon - Fri: 9AM - 5PM WAT",
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-600 hover:bg-blue-50",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-sky-500 hover:bg-sky-50",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-600 hover:bg-pink-50",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-700 hover:bg-blue-50",
    },
  ];

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        'Simply browse our courses page, select the course you want, and click "Enroll Now". You\'ll need to create an account or login, then proceed to payment via Paystack.',
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods through Paystack, including debit cards, bank transfers, and mobile money. All payments are secure and processed instantly.",
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer:
        "Yes! Upon successful completion of a course, you'll receive a digital certificate that you can download and share on LinkedIn or your portfolio.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Absolutely! Our platform is fully mobile-responsive. You can learn on any device - smartphone, tablet, or computer.",
    },
    {
      question: "What if I need help during a course?",
      answer:
        "We have a dedicated support team and community forum where you can ask questions. You can also reach out via email or our contact form.",
    },
    {
      question: "Are there any prerequisites for the courses?",
      answer:
        "Most of our beginner courses require no prerequisites. For intermediate and advanced courses, we'll list any requirements on the course page.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "We offer a 7-day money-back guarantee if you're not satisfied with a course. Contact us within 7 days of purchase for a full refund.",
    },
    {
      question: "Do you offer corporate training?",
      answer:
        "Yes! We provide customized corporate training solutions. Please contact us directly to discuss your organization's needs.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge className="text-sm px-4 py-2">Get In Touch</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold animate-fade-in-up animation-delay-200">
              We'd Love to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Hear From You
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in-up animation-delay-400">
              Have questions? Need support? Want to partner with us? Drop us a
              message and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Form & Business Card (50/50 Split) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form - 50% */}
            <Card className="border-2 hover:shadow-xl transition-all animate-fade-in-left">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center animate-bounce-in">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Send Us a Message</h2>
                    <p className="text-sm text-muted-foreground">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg flex items-center gap-3 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-accent-600" />
                    <p className="text-sm text-accent-700 dark:text-accent-400">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="animate-fade-in-up animation-delay-200">
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="John Doe"
                        className={errors.name ? "border-danger-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-danger-600 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="animate-fade-in-up animation-delay-300">
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className={errors.email ? "border-danger-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-danger-600 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="animate-fade-in-up animation-delay-400">
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      {...register("subject")}
                      placeholder="How can we help you?"
                      className={errors.subject ? "border-danger-500" : ""}
                    />
                    {errors.subject && (
                      <p className="text-sm text-danger-600 mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="animate-fade-in-up animation-delay-500">
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      {...register("message")}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className={errors.message ? "border-danger-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-danger-600 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full md:w-auto animate-fade-in-up animation-delay-600 hover:scale-105 transition-transform"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Business Card - 50% */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <Card className="border-2 hover:shadow-xl transition-all animate-fade-in-right">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary-600" />
                    </div>
                    Contact Information
                  </h3>

                  <div className="space-y-5">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 group animate-fade-in-up"
                        style={{ animationDelay: `${index * 100 + 200}ms` }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <info.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {info.title}
                          </p>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-base font-semibold hover:text-primary-600 transition-colors"
                            >
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-base font-semibold">
                              {info.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t">
                    <p className="text-sm font-medium mb-4">Follow Us</p>
                    <div className="flex gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${social.color} animate-bounce-in`}
                          style={{ animationDelay: `${index * 100 + 600}ms` }}
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links Card */}
              <Card className="border-2 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 hover:shadow-xl transition-all animate-fade-in-right animation-delay-400">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold">Need Quick Help?</h3>
                  <div className="space-y-2 text-sm">
                    <a
                      href="/courses"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200"
                    >
                      → Browse Our Courses
                    </a>
                    <a
                      href="/about"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200"
                    >
                      → Learn About Us
                    </a>
                    <a
                      href="#faq"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200"
                    >
                      → Check FAQs Below
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Wider */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our platform and courses
            </p>
          </div>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AccordionTrigger className="text-left hover:text-primary-600 text-base font-semibold py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <Card className="border-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-2xl transition-all animate-fade-in-up hover:scale-[1.02] relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-64 h-64 bg-white rounded-full -top-32 -left-32 animate-pulse"></div>
              <div className="absolute w-64 h-64 bg-white rounded-full -bottom-32 -right-32 animate-pulse animation-delay-1000"></div>
            </div>

            <CardContent className="p-12 text-center space-y-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold">
                Still have questions?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is
                here to help!
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:scale-110 transition-transform shadow-xl"
              >
                Send Us a Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 10px) scale(1.05); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Contact;
