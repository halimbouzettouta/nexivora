import { trpc } from '@/providers/trpc'

export function useApiOrders() {
  const utils = trpc.useUtils()

  // Admin: list all orders
  const listAll = () => {
    return trpc.order.list.useQuery(undefined, { staleTime: 10_000 })
  }

  // User: my orders
  const myOrders = () => {
    return trpc.order.myOrders.useQuery(undefined, {
      staleTime: 10_000,
      retry: 1,
    })
  }

  // Create order
  const createOrder = () => {
    return trpc.order.create.useMutation({
      onSuccess: () => {
        utils.order.myOrders.invalidate()
        utils.order.list.invalidate()
      },
    })
  }

  // Get order by number
  const getByNumber = (orderNumber: string) => {
    return trpc.order.getByNumber.useQuery(
      { orderNumber },
      { enabled: !!orderNumber, staleTime: 30_000 }
    )
  }

  // Validate referral code
  const validateReferral = (code: string) => {
    return trpc.referral.validate.useQuery(
      { code },
      { enabled: !!code && code !== 'NXADMIN', staleTime: 60_000 }
    )
  }

  // Get referral stats
  const getReferralStats = (code: string) => {
    return trpc.referral.getStats.useQuery(
      { code },
      { enabled: !!code, staleTime: 10_000 }
    )
  }

  // Get network
  const getNetwork = (userId: number) => {
    return trpc.referral.getNetwork.useQuery(
      { userId },
      { enabled: !!userId, staleTime: 10_000 }
    )
  }

  return {
    listAll,
    myOrders,
    createOrder,
    getByNumber,
    validateReferral,
    getReferralStats,
    getNetwork,
    utils,
  }
}
