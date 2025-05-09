import React, { useState } from 'react';
import {
  HelpCircle,
  FileText,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// Layout components
import OwnerNavbar from '@/components/owner/OwnerNavbar';
import OwnerSidebar from '@/components/owner/OwnerSidebar';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

/**
 * FAQItem - Component for displaying a single FAQ item
 */
const FAQItem: React.FC<{
  question: string;
  answer: string;
  id: string;
}> = ({ question, answer, id }) => {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-left">
        {question}
      </AccordionTrigger>
      <AccordionContent>
        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: answer }} />
      </AccordionContent>
    </AccordionItem>
  );
};



/**
 * HelpArticle - Component for displaying a help article card
 */
const HelpArticle: React.FC<{
  title: string;
  excerpt: string;
  category: string;
  onClick: () => void;
}> = ({ title, excerpt, category, onClick }) => {
  return (
    <Card className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <Badge variant="outline" className="w-fit mb-2">{category}</Badge>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="p-0 h-auto text-primary" onClick={onClick}>
          Read more <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * OwnerSupport - Help and Support page for property owners
 */
const OwnerSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('help-center');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock FAQ data
  const faqItems = [
    {
      id: 'faq-1',
      question: 'How do I add a new property?',
      answer: 'To add a new property, navigate to the <strong>Properties</strong> section from the sidebar and click on the <strong>Add Property</strong> button. Fill in the required details in the form and submit.'
    },
    {
      id: 'faq-2',
      question: 'How do I invite tenants to my property?',
      answer: 'Go to the <strong>Tenants</strong> section, click on <strong>Add New Tenant</strong>, fill in their details, and send an invitation. They will receive an email with instructions to create an account.'
    },
    {
      id: 'faq-3',
      question: 'How do I manage room assignments?',
      answer: 'You can assign tenants to rooms by going to the <strong>Tenants</strong> section, selecting a tenant, and clicking on <strong>Assign</strong>. Then select the property and room you want to assign them to.'
    },
    {
      id: 'faq-4',
      question: 'How do I update my payment information?',
      answer: 'Navigate to <strong>Payments</strong> in the sidebar, then select the <strong>Payment Methods</strong> tab. Here you can add, remove, or update your payment methods.'
    },
    {
      id: 'faq-5',
      question: 'Can I generate reports for my properties?',
      answer: 'Yes, you can view basic reports on the <strong>Dashboard</strong>. We are working on more detailed reporting features that will be available soon.'
    },
  ];

  // Mock help articles
  const helpArticles = [
    {
      id: 1,
      title: 'Getting Started with PG Room Management',
      excerpt: 'Learn the basics of managing your PG properties with our platform.',
      category: 'Getting Started'
    },
    {
      id: 2,
      title: 'Managing Multiple Properties Efficiently',
      excerpt: 'Tips and best practices for owners with multiple properties.',
      category: 'Property Management'
    },
    {
      id: 3,
      title: 'Tenant Communication Best Practices',
      excerpt: 'How to maintain good relationships with your tenants through effective communication.',
      category: 'Tenant Management'
    },
    {
      id: 4,
      title: 'Understanding Billing and Payments',
      excerpt: 'A comprehensive guide to the billing system and payment processing.',
      category: 'Billing'
    },
    {
      id: 5,
      title: 'Security Best Practices for Property Owners',
      excerpt: 'Keep your account and property information secure with these tips.',
      category: 'Security'
    },
    {
      id: 6,
      title: 'Troubleshooting Common Issues',
      excerpt: 'Solutions to common problems you might encounter while using the platform.',
      category: 'Troubleshooting'
    }
  ];



  // Handle article click
  const handleArticleClick = (articleId: number) => {
    toast.info(`Opening article #${articleId}`);
    // In a real app, this would navigate to the article page or open a modal
  };

  // Filter FAQ items based on search query
  const filteredFAQs = searchQuery
    ? faqItems.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <DashboardLayout
      navbar={<OwnerNavbar />}
      sidebar={<OwnerSidebar />}
    >
      <div className="w-full max-w-[98%] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Help & Support
            </h1>
            <p className="text-muted-foreground mt-1">
              Find answers to common questions in our Help Center and FAQ
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="help-center">Help Center</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Help Center Tab */}
          <TabsContent value="help-center" className="mt-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for help articles..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {helpArticles.map(article => (
                <HelpArticle
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  onClick={() => handleArticleClick(article.id)}
                />
              ))}
            </div>


          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search frequently asked questions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map(item => (
                <FAQItem
                  key={item.id}
                  id={item.id}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
              {filteredFAQs.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  No FAQs found matching your search. Try a different query or check the Help Center.
                </p>
              )}
            </Accordion>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                If you couldn't find the answer you were looking for, please check our comprehensive Help Center.
              </p>
              <Button onClick={() => setActiveTab('help-center')}>
                Visit Help Center
              </Button>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OwnerSupport;
