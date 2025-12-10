/* eslint-disable no-unused-vars */
// ============================================
// FILE: src/pages/user/ReferralsRewards.jsx
// ============================================
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Gift,
  Users,
  Copy,
  Share2,
  Trophy,
  TrendingUp,
  CheckCircle,
  Star,
  Coins,
  Target,
} from 'lucide-react';

const ReferralsRewards = () => {
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/referrals');

      if (response.data.success) {
        setReferralData(response.data.data);
      }
    } catch (error) {
      console.error('Referral data fetch error:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      const referralLink = `${window.location.origin}/register?ref=${referralData.referralCode}`;
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareReferralLink = async () => {
    try {
      const referralLink = `${window.location.origin}/register?ref=${referralData.referralCode}`;
      const shareData = {
        title: 'Join TechAge Africa',
        text: 'Start your tech journey with TechAge Africa! Use my referral code for exclusive benefits.',
        url: referralLink,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyReferralLink();
      }
    } catch (error) {
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading your rewards...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!referralData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Unable to load referral data</p>
        </div>
      </DashboardLayout>
    );
  }

  const { points, referralCode, referralsCount, completedCourses, achievements } = referralData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Referrals & Rewards
          </h1>
          <p className="text-muted-foreground">
            Earn points, unlock achievements, and share the knowledge!
          </p>
        </div>

        {/* Points Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-fade-in-up animation-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Points
                  </p>
                  <p className="text-3xl font-bold text-primary-600">{points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ₦{points.toLocaleString()} available
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    People Referred
                  </p>
                  <p className="text-3xl font-bold text-secondary-600">{referralsCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {referralsCount > 0 ? `${referralsCount * 500} points earned` : 'Start referring friends'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Courses Completed
                  </p>
                  <p className="text-3xl font-bold text-accent-600">{completedCourses}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedCourses > 0 ? `${completedCourses * 1000} points earned` : 'Complete courses to earn points'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="animate-fade-in-up animation-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label htmlFor="referral-link">Share this link with friends</Label>
                <div className="flex mt-1">
                  <Input
                    id="referral-link"
                    value={`${window.location.origin}/register?ref=${referralCode}`}
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button
                    onClick={copyReferralLink}
                    variant="outline"
                    className="rounded-l-none border-l-0"
                  >
                    <Copy className={`h-4 w-4 ${copySuccess ? 'text-green-600' : ''}`} />
                  </Button>
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={shareReferralLink} className="w-full sm:w-auto">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>How it works:</strong> Share your referral link with friends.
                When they register and purchase a course, you earn 500 points!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card className="animate-fade-in-up animation-delay-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800'
                      : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked
                        ? 'bg-accent-100 dark:bg-accent-900/30'
                        : 'bg-muted'
                    }`}>
                      {achievement.unlocked ? (
                        <CheckCircle className="h-5 w-5 text-accent-600" />
                      ) : (
                        <Target className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <Badge className="mt-2 bg-accent-600">
                          <Star className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Points System Info */}
        <Card className="animate-fade-in-up animation-delay-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="font-semibold mb-1">Purchase Course</h4>
                <p className="text-sm text-muted-foreground mb-2">Earn 500 points</p>
                <Badge variant="secondary">₦500 value</Badge>
              </div>

              <div className="text-center p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-secondary-600" />
                </div>
                <h4 className="font-semibold mb-1">Complete Course</h4>
                <p className="text-sm text-muted-foreground mb-2">Earn 1000 points</p>
                <Badge variant="secondary">₦1000 value</Badge>
              </div>

              <div className="text-center p-4 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-accent-600" />
                </div>
                <h4 className="font-semibold mb-1">Successful Referral</h4>
                <p className="text-sm text-muted-foreground mb-2">Earn 500 points</p>
                <Badge variant="secondary">₦500 value</Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Points Conversion:</strong> 1 point = 1 naira. Use your points as discount
                on future course purchases. Points never expire!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default ReferralsRewards;