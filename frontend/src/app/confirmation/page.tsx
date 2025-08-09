'use client';

import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { useGuests, useUpdateGuestStatus } from "@/lib/hooks/useGuests";

// Import our beautiful new components
import { GuestSearchForm } from "@/components/confirmation/GuestSearchForm";
import { GuestSelectionList } from "@/components/confirmation/GuestSelectionList";
import { FamilyWelcomeCard } from "@/components/confirmation/FamilyWelcomeCard";
import { FamilyMembersTable } from "@/components/confirmation/FamilyMembersTable";
import { ConfirmationActions } from "@/components/confirmation/ConfirmationActions";
import { LoadingState, ErrorState } from "@/components/confirmation/LoadingStates";

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

    const handleSearch = async (searchTerm: string) => {
        setIsSearching(true);
        setSearchTerm(searchTerm);
        try {
            // Search by name or phone in the guests array
            const matchingGuests = guests?.filter(g => 
                g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.phone.includes(searchTerm.replace(/\s/g, ''))
            ) || [];
            
            if (matchingGuests.length === 1) {
                // Exactly one match - proceed directly
                handleGuestSelection(matchingGuests[0]);
            } else if (matchingGuests.length > 1) {
                // Multiple matches - show selection list
                setMatchingGuests(matchingGuests);
                setFoundGuest(null);
                setGroupMembers([]);
                
                toast({
                    title: `Found ${matchingGuests.length} guests! 🔍`,
                    description: "Please select the guest you're looking for from the list below.",
                });
            } else {
                // No matches
                toast({
                    title: "Guest not found",
                    description: "Please check your name or phone number and try again.",
                    variant: "destructive"
                });
                setFoundGuest(null);
                setMatchingGuests([]);
                setGroupMembers([]);
            }
        } catch (err) {
            toast({
                title: "Search error",
                description: "Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleGuestSelection = (selectedGuest: any) => {
        setFoundGuest(selectedGuest);
        setMatchingGuests([]); // Clear the selection list
        
        // Find all family members in the same group
        const familyMembers = guests?.filter(g => g.group === selectedGuest.group) || [];
        
        // Convert to confirmation format with current status
        const membersWithConfirmation = familyMembers.map(member => ({
            ...member,
            isConfirmed: member.status === 'confirmed'
        }));
        
        setGroupMembers(membersWithConfirmation);
        
        toast({
            title: "Guest selected! 🎉",
            description: `Welcome ${selectedGuest.name}! Found ${familyMembers.length} family member(s).`,
        });
    };

    const handleMemberConfirmationToggle = (memberId: string) => {
        setGroupMembers(prev => 
            prev.map(member => 
                member.id === memberId 
                    ? { ...member, isConfirmed: !member.isConfirmed }
                    : member
            )
        );
    };

    const handleGroupConfirmation = async () => {
        if (groupMembers.length === 0) return;
        
        setIsUpdating(true);
        try {
            // Update each family member's status based on their confirmation
            const updatePromises = groupMembers.map(async (member) => {
                const newStatus = member.isConfirmed ? 'confirmed' : 'declined';
                if (member.status !== newStatus) {
                    await updateGuestStatus({
                        variables: {
                            id: member.id,
                            status: newStatus
                        }
                    });
                }
            });

            await Promise.all(updatePromises);
            
            const confirmedCount = groupMembers.filter(m => m.isConfirmed).length;
            const totalCount = groupMembers.length;
            
            toast({
                title: "Family confirmation updated! ✅",
                description: `${confirmedCount} out of ${totalCount} family members confirmed.`,
            });
            
            // Refresh the group members with updated status
            const updatedMembers = groupMembers.map(member => ({
                ...member,
                status: member.isConfirmed ? 'confirmed' : 'declined'
            }));
            setGroupMembers(updatedMembers);
            
        } catch (err) {
            toast({
                title: "Error updating confirmations",
                description: "Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReset = () => {
        setFoundGuest(null);
        setMatchingGuests([]);
        setGroupMembers([]);
        setSearchTerm('');
        setIsSearching(false);
        setIsUpdating(false);
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#FCF9F4] via-[#FAF7F2] to-[#F8F5F0] dark:from-[#2D2A26] dark:via-[#252219] dark:to-[#1C1A18]">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto space-y-12">
                        
                        {/* Beautiful Header */}
                        <div className="text-center space-y-6">
                            <div className="inline-block">
                                <h1 className="text-6xl sm:text-7xl font-serif font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 bg-clip-text text-transparent drop-shadow-sm">
                                    Confirmation
                                </h1>
                                <div className="h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent mt-4"></div>
                            </div>
                            <p className="text-xl sm:text-2xl text-[var(--primary)]/80 italic font-light">
                                Are you joining us? 🎉
                            </p>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-8">
                            {/* Error State */}
                            {error && (
                                <ErrorState 
                                    message="Unable to load guest information. Please check your connection and try again."
                                    onRetry={() => refetch()}
                                />
                            )}

                            {/* Loading State */}
                            {loading && !error && (
                                <LoadingState message="Loading guest information..." />
                            )}

                            {/* Search Form - Only show when no guest is found and not loading */}
                            {!foundGuest && matchingGuests.length === 0 && !loading && !error && (
                                <div className="flex justify-center">
                                    <GuestSearchForm 
                                        onSearch={handleSearch}
                                        isLoading={isSearching}
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {/* Guest Selection List - Show when multiple matches found */}
                            {matchingGuests.length > 1 && !loading && !error && (
                                <div className="space-y-6">
                                    <GuestSelectionList 
                                        guests={matchingGuests}
                                        onSelectGuest={handleGuestSelection}
                                        searchTerm={searchTerm}
                                    />
                                    
                                    {/* Back to Search Button */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleReset}
                                            className="text-[var(--primary)] hover:text-[var(--primary)]/80 underline text-sm"
                                        >
                                            ← Search again
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Family Confirmation Workflow */}
                            {foundGuest && groupMembers.length > 0 && !loading && !error && (
                                <div className="space-y-8">
                                    {/* Welcome Card */}
                                    <FamilyWelcomeCard 
                                        guestName={foundGuest.name}
                                        groupNumber={foundGuest.group}
                                        memberCount={groupMembers.length}
                                    />

                                    {/* Family Members Table */}
                                    <FamilyMembersTable 
                                        members={groupMembers}
                                        onToggleConfirmation={handleMemberConfirmationToggle}
                                        disabled={isUpdating || updateLoading}
                                    />

                                    {/* Confirmation Actions */}
                                    <ConfirmationActions 
                                        members={groupMembers}
                                        onConfirm={handleGroupConfirmation}
                                        onReset={handleReset}
                                        isLoading={isUpdating || updateLoading}
                                        disabled={loading}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}