import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../data/services';
import { ExpandedServiceView } from '../components/InteractiveServicesBento';

export default function ServicePage() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const service = getServiceById(serviceId);

    // Set SEO metadata
    useEffect(() => {
        if (service) {
            document.title = service.metaTitle || `${service.title} | Workshift`;

            // Update or create meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', service.metaDescription || service.tagline);

            // Update OG tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', service.metaTitle || service.title);
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', service.metaDescription || service.tagline);
        }

        return () => {
            // Restore defaults when leaving
            document.title = 'Workshift | Automatyzacja Procesów Biznesowych AI';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', 'Wdrażamy AI, które po prostu działa. Automatyzacja procesów, agenci AI, dedykowane aplikacje i szkolenia dla firm.');
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', 'Workshift | Automatyzacja Procesów Biznesowych AI');
        };
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
                </div>
            </div>
        </main>
    );
}
