import { Metadata } from 'next';
import ClientRedirect from './ClientRedirect';

interface Props {
  params: {
    code: string;
  };
}

// Generate SEO and OpenGraph tags dynamically based on the referral code
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const code = resolvedParams.code;
  
  return {
    title: `Book amazing venues recommended by our partner! | happylokam`,
    description: `Use referral code ${code} to get exclusive recommendations and offers on happylokam.`,
    openGraph: {
      title: 'Special Partner Recommendation | happylokam',
      description: 'Book amazing venues recommended by our partner!',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Special Partner Recommendation | happylokam',
      description: 'Book amazing venues recommended by our partner!',
    }
  };
}

export default async function ReferralLandingPage({ params }: Props) {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
        <p className="text-lg text-gray-600">
          You were referred by a trusted partner (Code: <span className="font-semibold text-blue-600">{code}</span>).
        </p>
        
        <p className="text-sm text-gray-500">
          We're applying your referral code and taking you to our best venues...
        </p>

        {/* Client component to handle cookie/localStorage and redirect */}
        <ClientRedirect referralCode={code} />
      </div>
    </div>
  );
}
