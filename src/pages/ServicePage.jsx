import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../data/services';
import { ExpandedServiceView } from '../components/InteractiveServicesBento';
import { ServiceArticle } from '../components/ui/ServiceArticle';
import { ServiceFaq } from '../components/ui/ServiceFaq';
import { GradientDivider } from '../components/ui/GradientDivider';
import { applyMeta, clampDescription } from '../lib/seo';

export default function ServicePage() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const service = getServiceById(serviceId);

    // Scroll to top on mount (and whenever the serviceId changes) - otherwise
    // the previous page's scroll position is preserved across client-side
    // navigation and users land deep inside the service page.
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [serviceId]);

    // Meta przez wspólne applyMeta() (to samo źródło co reszta tras i statyczny
    // fallback), bez ręcznego przywracania starych wartości przy wyjściu.
    useEffect(() => {
        if (!service) return undefined;
        applyMeta({
            title: service.metaTitle || `${service.title} | Workshift`,
            description: clampDescription(service.metaDescription || service.tagline),
            path: `/uslugi/${service.id}`,
        });
        return () => applyMeta();
    }, [service]);

    // Redirect if service not found
    useEffect(() => {
        if (!service) {
            navigate('/#uslugi', { replace: true });
        }
    }, [service, navigate]);

    if (!service) return null;

    const handleClose = () => {
        navigate('/#uslugi');
    };

    return (
        <main>
            <div className="pt-28 md:pt-32 pb-24 md:pb-32 bg-white relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">
                    <ExpandedServiceView
                        service={service}
                        onClose={handleClose}
                    />
                    {service.seoSections?.length > 0 && (
                        <div className="max-w-3xl mx-auto mt-20 md:mt-28">
                            <GradientDivider />
                        </div>
                    )}
                    <ServiceArticle
                        sections={service.seoSections}
                        related={[
                            { href: '/audyt-ai', label: 'Mikro-audyt AI (4 minuty)' },
                            { href: '/kalkulator', label: 'Kalkulator strat czasowych' },
                        ]}
                    />
                    <ServiceFaq faq={service.faq} heading={service.faqHeading} />
                </div>
            </div>
        </main>
    );
}
