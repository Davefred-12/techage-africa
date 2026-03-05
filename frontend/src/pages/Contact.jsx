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
  BookOpen,
  Shield,
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
      details: "support@jobladda.io",
      link: "mailto:support@jobladda.io",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+234 803 650 9531",
      link: "tel:+2348036509531",
      description: "Mon-Fri from 9AM to 5PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Lagos, Nigeria",
      link: null,
      description: "Africa's career readiness hub",
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
      href: "https://facebook.com/jobladda",
      label: "Facebook",
      color: "text-blue-600 bg-sky-50",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com/jobladda",
      label: "Twitter",
      color: "text-sky-500 bg-sky-50",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/jobladda",
      label: "Instagram",
      color: "text-pink-600 bg-pink-50",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/company/jobladda",
      label: "LinkedIn",
      color: "text-blue-700 bg-sky-50",
    },
  ];

  const contactReasons = [
    {
      icon: GraduationCap,
      title: "Job Readiness Test",
      description: "Questions about your assessment or report results",
      action: () => (window.location.href = "/register"),
    },
    {
      icon: BookOpen,
      title: "Career Courses",
      description: "Inquiries about our training modules and paths",
      action: () => (window.location.href = "/courses"),
    },
    {
      icon: Users,
      title: "Partnership Inquiry",
      description: "Collaborate with us on job placements or training",
      action: () =>
        document
          .getElementById("contact-form")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      icon: Shield,
      title: "Technical Support",
      description: "Issues with your dashboard or accessing content",
      action: () =>
        document
          .getElementById("contact-form")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  const faqs = [
    {
      question: "What is the Job Readiness Test?",
      answer:
        "The Job Readiness Test is a comprehensive assessment designed to identify the specific reasons why you might not be getting hired. It evaluates your profile, skills, and application strategy to provide actionable feedback.",
    },
    {
      question: "How long does it take to get my results?",
      answer:
        "You get your basic score and immediate feedback instantly after completing the test. A deep-dive analytical report with a 14-day action plan is available through our premium upgrade.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods through secure gateways, including debit cards, bank transfers, and mobile money. All payments are encrypted and processed instantly.",
    },
    {
      question: "Can I access Jobladda on my phone?",
      answer:
        "Yes! Jobladda is fully mobile-responsive. You can take the readiness test, access your reports, and take courses on any smartphone, tablet, or computer.",
    },
    {
      question: "What happens after the 14-day plan?",
      answer:
        "Our plan is designed to make you ATS-ready and interview-ready. After completing the plan, you'll have a significantly stronger profile and a clearer strategy to land your target roles.",
    },
    {
      question: "Do you offer job placement?",
      answer:
        "While we focus on making you 'hirable', we also have a network of partner employers. Users with high readiness scores often get recommended for openings within our network.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Blue Gradient with AOS */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-48 -left-48 animate-pulse"></div>
          <div
            className="absolute w-96 h-96 bg-white rounded-full -bottom-48 -right-48 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Get In Touch</span>
            </div>
            
            <h1 
              className="text-4xl md:text-6xl font-heading font-bold mb-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Contact JobLadda
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-primary-100 mb-8"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Have questions? We're here to help you navigate your career
              readiness journey.
            </p>
            
            <div 
              className="flex flex-wrap justify-center gap-4 text-sm"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span>24hr Response</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Mail className="h-4 w-4" />
                <span>Quick Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Users className="h-4 w-4" />
                <span>Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Reasons - Alternating Animations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How Can We Help You?
            </h2>
            <p className="text-muted-foreground">
              Choose your area of interest
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactReasons.map((reason, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all hover:-translate-y-2 group border-2 cursor-pointer"
                onClick={reason.action}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 100}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                    <reason.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Form & Contact Info with AOS */}
      <section className="py-20" id="contact-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - Contact Form (slides from left) */}
            <div className="space-y-6">
              {/* Contact Form Card */}
              <Card 
                className="border-2 hover:shadow-xl transition-all"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold">
                        Send Us a Message
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  {isSubmitted && (
                    <div className="mb-4 p-3 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0" />
                      <p className="text-xs text-accent-700 dark:text-accent-400">
                        Thank you! Your message has been sent successfully.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium mb-1.5">
                          Full Name *
                        </label>
                        <Input
                          {...register("name")}
                          placeholder="John Doe"
                          className={`h-10 ${
                            errors.name ? "border-red-500" : ""
                          }`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-medium mb-1.5">
                          Email Address *
                        </label>
                        <Input
                          {...register("email")}
                          type="email"
                          placeholder="john@example.com"
                          className={`h-10 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Subject *
                      </label>
                      <Input
                        {...register("subject")}
                        placeholder="What is this about?"
                        className={`h-10 ${
                          errors.subject ? "border-red-500" : ""
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Your Message *
                      </label>
                      <Textarea
                        {...register("message")}
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className={`text-sm ${
                          errors.message ? "border-red-500" : ""
                        }`}
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
                      className="w-full hover:scale-105 transition-transform h-11"
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

              {/* Response Information Card */}
              <Card 
                className="border-2 bg-primary-50 dark:bg-primary-900/20 hover:shadow-xl transition-all"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                    <h3 className="text-base font-bold">
                      Our Commitment to You
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-primary-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          Quick Response Time
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          We aim to respond to all inquiries within 24 hours
                          during business days. For urgent matters, please call
                          us directly.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-primary-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          Your Privacy Matters
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your information is secure and confidential. We never
                          share your contact details with third parties without
                          your consent.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-primary-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          Expert Support Team
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Our dedicated support team is knowledgeable about all
                          our courses and services, ready to provide
                          personalized assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT SIDE - Contact Information (slides from right) */}
            <div className="space-y-6">
              {/* Main Contact Card */}
              <Card 
                className="border-2 hover:shadow-xl transition-all"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                <CardContent className="p-6 lg:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold">
                      Contact Information
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {contactInfo.map((info, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 group hover:bg-muted/50 p-2.5 rounded-lg transition-all"
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
                            <p className="text-sm font-semibold truncate">
                              {info.details}
                            </p>
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
                          className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${social.color}`}
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
              <Card 
                className="border-2 bg-primary-50 dark:bg-primary-900/20 hover:shadow-xl transition-all"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary-600" />
                    <h3 className="text-base font-bold">Need Quick Help?</h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <a
                      href="/courses"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 items-center gap-2 py-1"
                    >
                      <span>→</span> Browse Our Courses
                    </a>
                    <a
                      href="/services"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 items-center gap-2 py-1"
                    >
                      <span>→</span> Explore Our Services
                    </a>
                    <a
                      href="/about"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 items-center gap-2 py-1"
                    >
                      <span>→</span> Learn About Us
                    </a>
                    <a
                      href="#faq"
                      className="block hover:text-primary-600 transition-colors hover:translate-x-2 transform duration-200 items-center gap-2 py-1"
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
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <Badge className="mb-4">Our Location</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Find Us in Lagos
            </h2>
            <p className="text-lg text-muted-foreground">
              Located in West Africa's tech hub, connecting African talent to
              global opportunities
            </p>
          </div>

          <Card 
            className="overflow-hidden border-2 hover:shadow-2xl transition-all"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62280943307!2d3.119919494725282!3d6.548055457294228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1638888888888!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JobLadda Location in Lagos, Nigeria"
              ></iframe>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about JobLadda, our
              courses, and services
            </p>
          </div>

          <Card 
            className="hover:shadow-xl transition-shadow border-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    data-aos="fade-left"
                    data-aos-delay={index * 50}
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
      <section className="py-20 bg-primary-600 relative overflow-hidden"  data-aos="zoom-in"
            data-aos-delay="200">
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
                Can't find the answer you're looking for? Our support team is
                here to help you! We're committed to providing excellent service
                and support.
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
