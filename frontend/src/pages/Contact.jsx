import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Briefcase,
  Users,
  GraduationCap,
  HelpCircle,
  Globe,
  Building,
  BookOpen
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
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
      title: "Email Us",
      details: "clinton@techageafrica.com",
      link: "mailto:clinton@techageafrica.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+234-XXX-XXX-XXXX",
      link: "tel:+234XXXXXXXXXX",
      description: "Mon-Fri from 9AM to 5PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Lagos, Nigeria",
      link: null,
      description: "West Africa's tech hub",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Mon - Fri: 9AM - 5PM WAT",
      link: null,
      description: "We're here to help",
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com/techageafrica",
      label: "Facebook",
      color: "hover:text-blue-600 hover:bg-blue-50",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com/techageafrica",
      label: "Twitter",
      color: "hover:text-sky-500 hover:bg-sky-50",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/techageafrica",
      label: "Instagram",
      color: "hover:text-pink-600 hover:bg-pink-50",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/company/techageafrica",
      label: "LinkedIn",
      color: "hover:text-blue-700 hover:bg-blue-50",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/234XXXXXXXXXX",
      label: "WhatsApp",
      color: "hover:text-green-600 hover:bg-green-50",
    },
  ];

  const contactReasons = [
    {
      icon: GraduationCap,
      title: "Course Enrollment",
      description: "Browse our courses, certifications, and learning paths",
      action: () => window.location.href = "/courses",
    },
    {
      icon: Briefcase,
      title: "Business Services",
      description: "Explore our SEO, marketing, branding, and web development services",
      action: () => window.location.href = "/services",
    },
    {
      icon: BookOpen,
      title: "Tech Updates Blog",
      description: "Read latest insights on AI, Web3, remote work, and tech trends",
      action: () => window.location.href = "/blog",
    },
    {
      icon: Users,
      title: "Partnership Inquiry",
      description: "Collaborate with us on training programs or corporate partnerships",
      action: () => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        'Browse our courses page, select the course you want, and click "Enroll Now". You\'ll need to create an account, then proceed to payment via Paystack. Once payment is confirmed, you\'ll get instant access to the course materials.',
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods through Paystack, including debit cards, credit cards, bank transfers, and mobile money. All payments are secure, encrypted, and processed instantly. We also offer payment plans for some premium courses.",
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer:
        "Yes! Upon successful completion of a course and passing any required assessments, you'll receive a digital certificate that you can download, share on LinkedIn, or add to your portfolio. Our certificates are recognized by employers across Africa.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Absolutely! Our platform is fully mobile-responsive and optimized for mobile learning. You can access your courses on any device - smartphone, tablet, or computer. We also have low-data consumption features for African learners.",
    },
    {
      question: "What if I need help during a course?",
      answer:
        "We have multiple support channels: dedicated support team via email, community forum where you can ask questions and connect with other learners, and direct access to instructors for course-related queries. We typically respond within 24 hours.",
    },
    {
      question: "Are there any prerequisites for the courses?",
      answer:
        "Most of our beginner courses require no prerequisites - just enthusiasm to learn! For intermediate and advanced courses, we'll clearly list any requirements on the course page. We recommend starting with our beginner courses if you're new to digital skills.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes! We offer a 7-day money-back guarantee if you're not satisfied with a course. Simply contact us within 7 days of purchase with your reason, and we'll process a full refund. Your satisfaction is our priority.",
    },
    {
      question: "Do you offer corporate training for organizations?",
      answer:
        "Yes! We provide customized corporate training solutions for organizations looking to upskill their teams. This includes tailored curriculum, dedicated support, progress tracking, and bulk enrollment options. Contact us directly to discuss your organization's needs.",
    },
    {
      question: "How can I partner with TechAge Africa?",
      answer:
        "We're open to various partnership opportunities including corporate training, institutional partnerships, content collaborations, and affiliate programs. Send us a message via the contact form or email clinton@techageafrica.com with your partnership proposal.",
    },
    {
      question: "What is the startup accelerator program?",
      answer:
        "Our startup accelerator (launching soon) will provide mentorship, non-equity grants, product development support, and market access for early-stage African tech startups. We'll focus on startups solving Africa's biggest problems. Stay updated by subscribing to our newsletter.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <Badge className="text-sm px-4 py-2">Get In Touch</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold animate-fade-in-up animation-delay-200">
              Let's Connect and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Grow Together
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up animation-delay-400">
              Have questions about our courses? Need business services? Want to partner with us? 
              We're here to help you accelerate your digital journey. Drop us a message and we'll 
              respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Reasons */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">How Can We Help You?</h2>
            <p className="text-muted-foreground">Choose your area of interest</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactReasons.map((reason, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all hover:-translate-y-2 group border-2 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={reason.action}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                    <reason.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Form & Contact Info */}
      <section className="py-20" id="contact-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-2 hover:shadow-xl transition-all animate-fade-in-left h-30">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center animate-bounce-in">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold">Send Us a Message</h2>
                    <p className="text-xs text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="mb-4 p-3 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg flex items-center gap-2 animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0" />
                    <p className="text-xs text-accent-700 dark:text-accent-400">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="animate-fade-in-up animation-delay-200">
                      <label className="block text-xs font-medium mb-1.5">
                        Full Name *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="John Doe"
                        className={`h-10 ${errors.name ? "border-red-500" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="animate-fade-in-up animation-delay-300">
                      <label className="block text-xs font-medium mb-1.5">
                        Email Address *
                      </label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className={`h-10 ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="animate-fade-in-up animation-delay-400">
                    <label className="block text-xs font-medium mb-1.5">
                      Subject *
                    </label>
                    <Input
                      {...register("subject")}
                      placeholder="What is this about?"
                      className={`h-10 ${errors.subject ? "border-red-500" : ""}`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="animate-fade-in-up animation-delay-500">
                    <label className="block text-xs font-medium mb-1.5">
                      Your Message *
                    </label>
                    <Textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className={`text-sm ${errors.message ? "border-red-500" : ""}`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className="w-full animate-fade-in-up animation-delay-600 hover:scale-105 transition-transform h-11"
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
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Main Contact Card */}
              <Card className="border-2 hover:shadow-xl transition-all animate-fade-in-right">
                <CardContent className="p-6 lg:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold">Contact Information</h3>
                  </div>

                  <div className="space-y-5">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 group animate-fade-in-up hover:bg-muted/50 p-2.5 rounded-lg transition-all"
                        style={{ animationDelay: `${index * 100 + 200}ms` }}
                      >
                        <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <info.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {info.title}
                          </p>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-sm font-semibold hover:text-primary-600 transition-colors block truncate"
                            >
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-sm font-semibold truncate">{info.details}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs font-medium mb-3">Connect With Us</p>
                    <div className="flex gap-2.5">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${social.color} animate-bounce-in`}
                          style={{ animationDelay: `${index * 100 + 600}ms` }}
                          aria-label={social.label}
                        >
                          <social.icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links Card */}
              <Card className="border-2 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 hover:shadow-xl transition-all animate-fade-in-right animation-delay-400">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary-600" />
                    <h3 className="text-base font-bold">Need Quick Help?</h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <a
                      href="/courses"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 flex items-center gap-2 py-1"
                    >
                      <span>→</span> Browse Our Courses
                    </a>
                    <a
                      href="/services"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 flex items-center gap-2 py-1"
                    >
                      <span>→</span> Explore Our Services
                    </a>
                    <a
                      href="/about"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 flex items-center gap-2 py-1"
                    >
                      <span>→</span> Learn About Us
                    </a>
                    <a
                      href="#faq"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 flex items-center gap-2 py-1"
                    >
                      <span>→</span> Check FAQs Below
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 animate-fade-in-up">
            <Badge className="mb-4">Our Location</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Find Us in Lagos
            </h2>
            <p className="text-lg text-muted-foreground">
              Located in West Africa's tech hub, connecting African talent to global opportunities
            </p>
          </div>

          <Card className="overflow-hidden border-2 hover:shadow-2xl transition-all animate-fade-in-up">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62280943307!2d3.119919494725282!3d6.548055457294228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1638888888888!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TechAge Africa Location in Lagos, Nigeria"
              ></iframe>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 animate-fade-in-up">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about TechAge Africa, our courses, and services
            </p>
          </div>

          <Card className="hover:shadow-xl transition-shadow border-2">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
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
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white rounded-full -bottom-48 -right-48 animate-pulse animation-delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:shadow-2xl transition-all animate-fade-in-up hover:scale-[1.02]">
            <CardContent className="p-12 text-center space-y-6 text-white">
              <h2 className="text-3xl md:text-4xl font-bold">
                Still Have Questions?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you! 
                We're committed to providing excellent service and support.
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

        .animation-delay-100 { animation-delay: 100ms; }
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