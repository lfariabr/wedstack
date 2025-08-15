'use client';

import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { useGuests, useUpdateGuestStatus } from "@/lib/hooks/useGuests";
import { Search, Users, CheckCircle } from "lucide-react";

// Import our beautiful new components
import { GuestSearchForm } from "@/components/confirmation/GuestSearchForm";
import { GuestSelectionList } from "@/components/confirmation/GuestSelectionList";
import { FamilyWelcomeCard } from "@/components/confirmation/FamilyWelcomeCard";
import { FamilyMembersTable } from "@/components/confirmation/FamilyMembersTable";
import { ConfirmationActions } from "@/components/confirmation/ConfirmationActions";
import { LoadingState, ErrorState } from "@/components/confirmation/LoadingStates";
import { useI18n } from '@/lib/i18n/I18nProvider';


interface GuestConfirmation {
    id: string;
    name: string;
    phone: string;
    group: string;
    status: string;
    plusOnes: number;
    isConfirmed: boolean;
}

export default function ConfirmationPage() {
    const { toast } = useToast();
    const [foundGuest, setFoundGuest] = useState<any>(null);
    const [matchingGuests, setMatchingGuests] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [groupMembers, setGroupMembers] = useState<GuestConfirmation[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const { guests, loading, error, refetch } = useGuests();
    const { updateGuestStatus, loading: updateLoading } = useUpdateGuestStatus();
    const { t } = useI18n();
    

    const handleSearch = async (searchTerm: string) => {
        setIsSearching(true);
        setSearchTerm(searchTerm);

        try {
            if (!guests || guests.length === 0) {
                toast({
                    title: t('confirmation.noneFoundTitle'),
                    description: t('confirmation.noneFoundDesc'),
                    variant: "destructive"
                });
                return;
            }

            const searchLower = searchTerm.toLowerCase().trim();
            const matches = guests.filter(guest => 
                guest.name.toLowerCase().includes(searchLower) ||
                (guest.phone && guest.phone.toLowerCase().includes(searchLower))
            );

            if (matches.length === 0) {
                toast({
                    title: t('confirmation.notFoundTitle'),
                    description: t('confirmation.notFoundDesc'),
                    variant: "destructive"
                });
                setFoundGuest(null);
                setMatchingGuests([]);
                setGroupMembers([]);
            } else if (matches.length === 1) {
                // Single match - proceed directly
                const guest = matches[0];
                setFoundGuest(guest);
                setMatchingGuests([]);
                
                // Find all family group members
                const familyMembers = guests.filter(g => g.group === guest.group);
                const membersWithConfirmation = familyMembers.map(member => ({
                    id: member.id,
                    name: member.name,
                    phone: member.phone || '',
                    group: member.group,
                    status: member.status,
                    plusOnes: member.plusOnes || 0,
                    isConfirmed: false // Will be set by user interaction
                }));
                
                setGroupMembers(membersWithConfirmation);
            } else {
                // Multiple matches - show selection list
                setMatchingGuests(matches);
                setFoundGuest(null);
                setGroupMembers([]);
            }
        } catch (err) {
            toast({
                title: t('confirmation.searchErrorTitle'),
                description: t('confirmation.searchErrorDesc'),
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleGuestSelect = (selectedGuest: any) => {
        setFoundGuest(selectedGuest);
        setMatchingGuests([]);
        
        // Find all family group members
        const familyMembers = guests?.filter(g => g.group === selectedGuest.group) || [];
        const membersWithConfirmation = familyMembers.map(member => ({
            id: member.id,
            name: member.name,
            phone: member.phone || '',
            group: member.group,
            status: member.status,
            plusOnes: member.plusOnes || 0,
            isConfirmed: false
        }));
        
        setGroupMembers(membersWithConfirmation);
    };

    const handleMemberToggle = (memberId: string, isConfirmed: boolean) => {
        setGroupMembers(prev => 
            prev.map(member => 
                member.id === memberId 
                    ? { ...member, isConfirmed }
                    : member
            )
        );
    };

    const handleConfirmAll = async () => {
        setIsUpdating(true);
        
        try {
            const confirmedMembers = groupMembers.filter(m => m.isConfirmed);
            
            if (confirmedMembers.length === 0) {
                toast({
                    title: t('confirmation.noneSelectedTitle'),
                    description: t('confirmation.noneSelectedDesc'),
                    variant: "destructive"
                });
                return;
            }

            // Update each confirmed member
            for (const member of confirmedMembers) {
                await updateGuestStatus({
                    variables: {
                        id: member.id,
                        status: 'confirmed'
                    }
                });
            }

            toast({
                title: t('confirmation.confirmSuccessTitle'),
                description: `${confirmedMembers.length} ${t('confirmation.guestsConfirmed')}`,
            });

            // Reset form
            setFoundGuest(null);
            setGroupMembers([]);
            setMatchingGuests([]);
            setSearchTerm('');
            
            // Refetch guests to update the data
            refetch();

        } catch (err) {
            toast({
                title: t('confirmation.confirmErrorTitle'),
                description: t('confirmation.confirmErrorDesc'),
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReset = () => {
        setFoundGuest(null);
        setGroupMembers([]);
        setMatchingGuests([]);
        setSearchTerm('');
    };

    if (loading) return <LoadingState />;
    if (error) return <ErrorState />;

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
                <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">
                    
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="w-script text-6xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
                            {t('confirmation.title')}
                        </h1>
                        <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
                            {t('confirmation.subtitle')}
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/20 shadow-md border border-[var(--border)] w-full">
                        <div className="flex items-start gap-4">
                            <Search className="w-6 h-6 mt-1 text-primary" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-xl mb-4">{t('confirmation.searchTitle')}</h3>
                                <GuestSearchForm 
                                    onSearch={handleSearch}
                                    isLoading={isSearching}
                                    initialValue={searchTerm}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Multiple Guests Selection */}
                    {matchingGuests.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#D9ADD1] shadow-md border border-[var(--border)] w-full">
                            <div className="flex items-start gap-4">
                                <Users className="w-6 h-6 mt-1 text-primary" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl mb-4">{t('confirmation.multipleFoundTitle')}</h3>
                                    <GuestSelectionList 
                                        guests={matchingGuests}
                                        onSelectGuest={handleGuestSelect}
                                        searchTerm={searchTerm}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Family Welcome & Members */}
                    {foundGuest && groupMembers.length > 0 && (
                        <>
                            {/* Welcome Card */}
                            <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/15 shadow-md border border-[var(--border)] w-full">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 mt-1 text-primary" />
                                    <div className="flex-1">
                                    <FamilyWelcomeCard 
                                        guestName={foundGuest.name}
                                        groupNumber={foundGuest.group}
                                        memberCount={groupMembers.length}
                                    />
                                    </div>
                                </div>
                            </div>

                            {/* Members Table */}
                            <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#D9ADD1] shadow-md border border-[var(--border)] w-full">
                                <div className="flex items-start gap-4">
                                    <Users className="w-6 h-6 mt-1 text-primary" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-xl mb-4">{t('confirmation.familyMembersTitle')}</h3>
                                        <FamilyMembersTable 
                                            members={groupMembers}
                                            onMemberToggle={handleMemberToggle}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Confirmation Actions */}
                            <div className="w-full">
                                <ConfirmationActions
                                    members={groupMembers}
                                    onConfirm={handleConfirmAll}
                                    onReset={handleReset}
                                    isLoading={isUpdating}
                                    disabled={updateLoading}
                                />
                            </div>
                        </>
                    )}

                </main>
            </div>
        </MainLayout>
    );
}