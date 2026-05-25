import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

// Auth gate dla strony oferty.
// POST /api/offers/verify { slug, password } - backend ustawia httpOnly cookie.
// Po sukcesie odpalamy onUnlock() - OfferPage przeładuje dane z API.

export function OfferGate({ slug, clientName, onUnlock }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/offers/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ slug, password: value.trim() }),
            });
            if (res.ok) {
                onUnlock();
                return;
            }
            if (res.status === 401) {
                setError('Nieprawidłowe hasło. Sprawdź mail lub napisz na jakub@workshift.pl.');
            } else if (res.status === 500) {
                setError('Coś nie zagrało po naszej stronie. Spróbuj ponownie za chwilę.');
            } else {
                setError('Nie udało się zweryfikować dostępu. Spróbuj ponownie.');
            }
        } catch (err) {
            setError('Brak połączenia z serwerem. Sprawdź sieć i spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-sage flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="flex justify-center mb-10">
                    <Logo variant="light" size={48} />
                </div>

                <div className="glass-panel rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center">
                            <Lock size={18} className="text-black" />
                        </div>
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dark">Oferta prywatna</p>
                            <p className="text-base font-display tracking-tight text-black">{clientName}</p>
                        </div>
                    </div>

                    <p className="text-sm text-muted-dark mb-6 leading-relaxed">
                        Ta oferta została przygotowana indywidualnie. Wprowadź hasło dostępu otrzymane w mailu, aby zobaczyć szczegóły.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
                        <input
                            type="password"
                            value={value}
                            onChange={(e) => { setValue(e.target.value); setError(''); }}
                            placeholder="Hasło dostępu"
                            autoFocus
                            disabled={loading}
                            autoComplete="off"
                            className="w-full h-12 px-4 rounded-md border border-black/15 bg-white/70 text-black placeholder:text-muted-light focus:outline-none focus:border-black focus:ring-2 focus:ring-lime/40 transition disabled:opacity-50"
                        />
                        {error && (
                            <p className="text-sm text-[#DD453D]">{error}</p>
                        )}
                        <Button type="submit" variant="default" size="lg" className="w-full h-12" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    Weryfikuję...
                                </span>
                            ) : 'Otwórz ofertę'}
                        </Button>
                    </form>

                    <p className="mt-6 text-xs text-muted-light text-center">
                        Strona prywatna, nieindeksowana, dostęp tylko po weryfikacji hasła.
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
