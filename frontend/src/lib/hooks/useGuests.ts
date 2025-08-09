import { useQuery, useMutation } from '@apollo/client';
import { GET_GUESTS, GET_GUEST, GET_GUESTS_BY_NAME, GET_GUESTS_BY_PHONE, GET_GUESTS_BY_GROUP, GET_GUESTS_BY_STATUS, GET_GUESTS_BY_PLUS_ONES } from '../graphql/queries/guest.queries';
import { UPDATE_GUEST_STATUS, UPDATE_GUEST_GROUP, UPDATE_GUEST_PLUS_ONES } from '../graphql/mutations/guest.mutations';
import { Guest, GuestData, GuestsData, GuestInput, UpdateGuestStatusData, UpdateGuestGroupData, UpdateGuestPlusOnesData } from '../graphql/types/guest.types';

export const useGuests = () => {
  const { data, loading, error, refetch } = useQuery<GuestsData>(GET_GUESTS);

  return {
    guests: data?.guests || [],
    loading,
    error,
    refetch,
  };
};

export const useGuest = (id: string) => {
  const { data, loading, error, refetch } = useQuery<GuestData>(GET_GUEST, {
    variables: { id },
    skip: !id,
  });

  return {
    guest: data?.guest,
    loading,
    error,
    refetch,
  };
};

export const useGuestsByName = (name: string) => {
  const { data, loading, error, refetch } = useQuery(GET_GUESTS_BY_NAME, {
    variables: { name },
    skip: !name,
  });

  return {
    guests: data?.guestsByName || [],
    loading,
    error,
    refetch,
  };
};

export const useGuestsByPhone = (phone: string) => {
  const { data, loading, error, refetch } = useQuery(GET_GUESTS_BY_PHONE, {
    variables: { phone },
    skip: !phone,
  });

  return {
    guests: data?.guestsByPhone || [],
    loading,
    error,
    refetch,
  };
};

export const useGuestsByGroup = (group: string) => {
  const { data, loading, error, refetch } = useQuery(GET_GUESTS_BY_GROUP, {
    variables: { group },
    skip: !group,
  });

  return {
    guests: data?.guestsByGroup || [],
    loading,
    error,
    refetch,
  };
};

export const useGuestsByStatus = (status: string) => {
  const { data, loading, error, refetch } = useQuery(GET_GUESTS_BY_STATUS, {
    variables: { status },
    skip: !status,
  });

  return {
    guests: data?.guestsByStatus || [],
    loading,
    error,
    refetch,
  };
};

export const useGuestsByPlusOnes = (plusOnes: number) => {
  const { data, loading, error, refetch } = useQuery(GET_GUESTS_BY_PLUS_ONES, {
    variables: { plusOnes },
    skip: plusOnes === undefined,
  });

  return {
    guests: data?.guestsByPlusOnes || [],
    loading,
    error,
    refetch,
  };
};

export const useUpdateGuestStatus = () => {
  const [updateGuestStatus, { loading, error }] = useMutation<UpdateGuestStatusData>(UPDATE_GUEST_STATUS, {
    refetchQueries: [{ query: GET_GUESTS }],
  });

  return {
    updateGuestStatus,
    loading,
    error,
  };
};

export const useUpdateGuestGroup = () => {
  const [updateGuestGroup, { loading, error }] = useMutation<UpdateGuestGroupData>(UPDATE_GUEST_GROUP, {
    refetchQueries: [{ query: GET_GUESTS }],
  });

  return {
    updateGuestGroup,
    loading,
    error,
  };
};

export const useUpdateGuestPlusOnes = () => {
  const [updateGuestPlusOnes, { loading, error }] = useMutation<UpdateGuestPlusOnesData>(UPDATE_GUEST_PLUS_ONES, {
    refetchQueries: [{ query: GET_GUESTS }],
  });

  return {
    updateGuestPlusOnes,
    loading,
    error,
  };
};
