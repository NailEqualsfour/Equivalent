import { supabase } from '@/database'
import moment from 'moment'

function SupabaseService() {

    // User Functions 
    async function getUserBySerial(serial: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('serial', serial)
            .single()
        if (error) throw error
        return data
    }



    // Category Functions
    async function getCategoriesByUserId(userId: string) {
        const { data, error } = await supabase 
            .from('categories')
            .select('*')
            .eq('userId', userId)
            .order('position', { ascending: true })
        if (error) throw error
        return data
    } 

    async function createCategory(item: { userId: string, name: string, color: string, position?: number }) {
        const { error } = await supabase
            .from('categories')
            .insert({
                ...item
            })
        if (error) throw error
    }

    async function updateCategory(categoryId: string, item: { name?: string, color?: string, position?: number }) {
        const { error } = await supabase 
            .from('categories') 
            .update({
                ...item
            })
            .eq('id', categoryId)
        if (error) throw error
    }

    async function deleteCategory(categoryId: string) {
        const { error } = await supabase 
            .from('categories') 
            .delete() 
            .eq('id', categoryId)
        if (error) throw error
    }



    // Budget Functions
    async function getBudgetByPeriod(userId: string, period: string) {
        var start = null
        var end = null
        if (period == 'This month') {
            start = moment().format('YYYY-MM')
            end = moment().format('YYYY-MM')
        }
        if (period == 'Last month') {
            start = moment().subtract(1, 'months').format('YYYY-MM')
            end = moment().subtract(1, 'months').format('YYYY-MM')
        }
        if (period == 'This year') {
            start = moment().startOf('year').format('YYYY-MM')
            end = moment().endOf('year').format('YYYY-MM')
        }
        if (period == 'Last year') {
            start = moment().subtract(1, 'years').startOf('year').format('YYYY-MM')
            end = moment().subtract(1, 'years').endOf('year').format('YYYY-MM')
        }
        const { data, error } = await supabase.rpc('get_total_budget', {
            p_userid: userId,
            p_start: start,
            p_end: end
        })
        if (error) throw error
        return data
    }

    async function updateBudget(userId: string, budget: number) {
        const { error } = await supabase
            .from('budgets') 
            .update({ 
                budget: budget
            })
            .eq('userId', userId)
            .eq('time', moment().format('YYYY-MM'))
        if (error) throw error
    }



    // Transaction Functions 
    async function getTransactionByUserId(id: string) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('userId', id)
            .order('timeCreated', { ascending: false })
        if (error) throw error 
        return data
    } 

    async function getTransactionByPeriod(userId: string, period: string) {
        var query = supabase
            .from('transactions')
            .select('*')
            .eq('userId', userId)
            .order('cost', { ascending: false })
        if (period == 'This month') {
            query = query
                .gte('timeCreated', moment().startOf('month').format('YYYY-MM-DD') + '-00:00:00')
                .lte('timeCreated', moment().endOf('month').format('YYYY-MM-DD') + '-23:59:59')
        }
        if (period == 'Last month') {
            query = query
                .gte('timeCreated', moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD') + '-00:00:00')
                .lte('timeCreated', moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD') + '-23:59:59')
        }
        if (period == 'This year') {
            query = query
                .gte('timeCreated', moment().startOf('year').format('YYYY-MM-DD') + '-00:00:00')
                .lte('timeCreated', moment().endOf('year').format('YYYY-MM-DD') + '-23:59:59')
        }
        if (period == 'Last year') {
            query = query
                .gte('timeCreated', moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD') + '-00:00:00')
                .lte('timeCreated', moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD') + '-23:59:59')
        }
        const { data, error } = await query
        if (error) throw error
        return data
    } 

    async function getTransactionByCategoryId(userId: string, categoryId: string) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('userId', userId)
            .eq('categoryId', categoryId)
            .order('cost', { ascending: false })
        if (error) throw error
        return data
    }

    async function getTransactionGroupbyCategoryByPeriod(userId: string, period: string) {
        const returnList: { userId: string; name: string; cost: number }[] = [];
        const categoryMap: Record<string, { userId: string; name: string; color: string; cost: number }> = {};
        const [categories, periodTransactions] = await Promise.all([
        getCategoriesByUserId(userId),
        getTransactionByPeriod(userId, period)
        ])
        for (var category of categories) {
            categoryMap[category.id] = { userId, name: category.name, color: category.color, cost: 0 }
        }
        for (const transaction of periodTransactions) {
            if (transaction.categoryId && categoryMap[transaction.categoryId]) {
                categoryMap[transaction.categoryId].cost += transaction.cost
            }
        }
        for (const key in categoryMap) {
            returnList.push(categoryMap[key]);
        }
        returnList.sort((a, b) => b.cost - a.cost)
        return returnList;
    }

    async function getTotalTransactionCostByPeriod(userId: string, period: string) {
        var start = null
        var end = null
        if (period == 'This month') {
            start = moment().startOf('month').format('YYYY-MM-DD') + '-00:00:00'
            end = moment().endOf('month').format('YYYY-MM-DD') + '-23:59:59'
        }
        if (period == 'Last month') {
            start = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD') + '-00:00:00'
            end = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD') + '-23:59:59'
        }
        if (period == 'This year') {
            start = moment().startOf('year').format('YYYY-MM-DD') + '-00:00:00'
            end = moment().endOf('year').format('YYYY-MM-DD') + '-23:59:59'
        }
        if (period == 'Last year') {
            start = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD') + '-00:00:00'
            end = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD') + '-23:59:59'
        }
        const { data, error } = await supabase.rpc('get_total_transaction_cost', {
            p_userid: userId,
            p_start: start,
            p_end: end
        })
        if (error) throw error
        return data
    }

    async function createTransaction(item: { userId: string, name?: string, categoryId: string, cost: number, timeCreated: string }) {
        const { error } = await supabase 
            .from('transactions')
            .insert({
                ...item
            })
        if (error) throw error
    }

    async function updateTransaction(transactionId: string, updates: { userId?: string, name?: string, cost?: number, categoryId?: string, timeCreated?: string, timeEdited?: string }) {
        const { error } = await supabase
            .from('transactions')
            .update({
                ...updates
            })
            .eq('id', transactionId)
        if (error) throw error
    }

    async function deleteTransaction(transactionId: string) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
        if (error) throw error
    }



    return {
        getUserBySerial,
        getCategoriesByUserId,
        createCategory,
        updateCategory,
        deleteCategory,
        getBudgetByPeriod,
        updateBudget,
        getTransactionByUserId,
        getTransactionByCategoryId,
        getTransactionGroupbyCategoryByPeriod, 
        getTotalTransactionCostByPeriod,
        createTransaction,
        updateTransaction,
        deleteTransaction
    }
}

export default SupabaseService