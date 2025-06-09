import moment from "moment"

function DatabaseService() {

  var users = [
    { 
      userId: '6d40f748dd1d8bbe', // Mine
      categories: [
        { name: 'Wife', color: '#F97A42', position: 0 }, //name 13 string
        { name: 'Entertainment', color: '#EC4EA4', position: 1 },
        { name: 'Skincare', color: '#B1E733', position: 2 },
        { name: 'Transport', color: '#6061D6', position: 4 },
        { name: 'Rent', color: '#06D3E2', position: 5 },
        { name: 'Shopping', color: '#04BF62', position: 6 },
        { name: 'Meal', color: '#E3346E', position: 7 }
      ],
      budgets: [
        {budget: 700, time: '2025-05'},
        {budget: 700, time: '2024-12'},
        {budget: 50, time: '2024-11'},
        {budget: 1000, time: '2023-11'},
      ]
    },
    { 
      userId: '12138508123cda2f', // Caro
      categories: [
        { name: 'Transport', color: 'white', position: 0 },
        { name: 'Shopping', color: 'black', position: 1 },
        { name: 'Meal', color: '#E3346E', position: 2 }
      ],
      budgets: [
        {budget: 700, time: '2024-12'},
        {budget: 700, time: '2024-11'},
        {budget: 1000, time: '2023-11'},
      ]
    } 
  ]

  var transactions = [
    { userId: '6d40f748dd1d8bbe', category: 'Wife', cost: 2.1, name: '', time: '2025-06-01-23:58:10', editedTime: '' }, //name 18 String
    { userId: '6d40f748dd1d8bbe', category: 'Wife', cost: 100, name: '', time: '2025-06-17-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Rent', cost: 230, name: 'First rent for ma', time: '2025-06-01-23:38:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Transport', cost: 49.20, name: '', time: '2025-06-21-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2025-06-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Wife', cost: 54, name: 'Rose', time: '2025-06-01-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Meal', cost: 10, name: '', time: '2025-06-01-23:58:12', editedTime: '' },
    { userId: '12138508123cda2f', category: 'Skincare', cost: 100, name: '', time: '2025-06-01-23:58:12', editedTime: '' },
    { userId: '12138508123cda2f', category: 'Skincare', cost: 50, name: '', time: '2025-06-01-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Skincare', cost: 2, name: '', time: '2025-06-01-23:58:12', editedTime: '' }, 
    { userId: '6d40f748dd1d8bbe', category: 'Shopping', cost: 69.75, name: '', time: '2025-06-01-23:58:12', editedTime: '' }, 
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '', time: '2024-09-30-23:58:12', editedTime: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Skincare', cost: 2, name: '', time: '2024-12-01-23:58:12', editedTime: '' }, 
    { userId: '6d40f748dd1d8bbe', category: 'Shopping', cost: 69.75, name: '', time: '2024-12-01-23:58:12', editedTime: '' }, 
    { userId: '6d40f748dd1d8bbe', category: 'Skincare', cost: 2, name: '', time: '2024-12-01-23:58:12', editedTime: '' }, 
    { userId: '6d40f748dd1d8bbe', category: 'Shopping', cost: 69.75, name: '', time: '2024-12-01-23:58:12', editedTime: '' }, 
  ]




  //User Functions
  function getUserById(id: string) { // Backend Query when connected to Supabase
    for (var user of users) {
      if (user.userId == id) {
        return user
      }
    }
  }
  function getUserCategories(userId: string) {
    var returnList = []
    var userCategories = getUserById(userId)!.categories
    userCategories.sort((a, b) => a.position - b.position)
    for (var category of userCategories) {
      returnList.push(category.name)
    }
    return returnList
  }
  function getCategoryColor(userId: string, category: string) {
    for (var categoryItem of getUserById(userId)?.categories!) {
      if (categoryItem.name == category) {
        return categoryItem.color
      }
    }
    return 'black'
  }
  function getBudgetByPeriod(userId: string, period: string) {
    var returnBudget = 0
    if (period == 'This month') {
      for (var budget of getUserById(userId)?.budgets!) {
        if (budget.time.includes(moment().format('YYYY-MM'))) {
          returnBudget = returnBudget + budget.budget
        }
      }
    }
    if (period == 'Last month') {
      for (var budget of getUserById(userId)?.budgets!) {
        if (budget.time.includes(moment().subtract(1, 'months').format('YYYY-MM'))) {
          returnBudget = returnBudget + budget.budget
        }
      }
    }
    if (period == 'This year') {
      for (var budget of getUserById(userId)?.budgets!) {
        if (budget.time.includes(moment().format('YYYY-'))) {
          returnBudget = returnBudget + budget.budget
        }
      }
    }
    if (period == 'Last year') {
      for (var budget of getUserById(userId)?.budgets!) {
        if (budget.time.includes(moment().subtract(1, 'years').format('YYYY-'))) {
          returnBudget = returnBudget + budget.budget
        }
      }
    }
    if (period == 'Lifetime') {
      for (var budget of getUserById(userId)?.budgets!) {
        returnBudget = returnBudget + budget.budget
      }
    }
    return returnBudget
  }



  //TransactionFunctions
  function getTransactionByUserId(id: string) {
    var returnList = []
    for (var transaction of transactions) {
      if (transaction.userId == id) {
        returnList.push(transaction)
      }
    }
    returnList.sort((a, b) => b.time.localeCompare(a.time))
    return returnList
  }
  function getTransactionByPeriod(userId: string, period: string) {
    var returnList = []
    if (period == 'This month') {
      for (var transaction of getTransactionByUserId(userId)) {
        if (moment(transaction.time, 'YYYY-MM-DD-HH:mm:ss').month() == moment().month()) {
          returnList.push(transaction)
        }
      }
    }
    if (period == 'Last month') {
      for (var transaction of getTransactionByUserId(userId)) {
        if (moment(transaction.time, 'YYYY-MM-DD-HH:mm:ss').month() == moment().subtract(1, 'months').month()) {
          returnList.push(transaction)
        }
      }
    }
    if (period == 'This year') {
      for (var transaction of getTransactionByUserId(userId)) {
        if (moment(transaction.time, 'YYYY-MM-DD-HH:mm:ss').year() == moment().year()) {
          returnList.push(transaction)
        }
      }
    }
    if (period == 'Last year') {
      for (var transaction of getTransactionByUserId(userId)) {
        if (moment(transaction.time, 'YYYY-MM-DD-HH:mm:ss').year() == moment().subtract(1, 'years').year()) {
          returnList.push(transaction)
        }
      }
    }
    if (period == 'Lifetime') {
      returnList = getTransactionByUserId(userId)
    }
    returnList.sort((a, b) => b.cost - a.cost)
    return returnList
  }
  function getTransactionByCategory(userId: string, category: string) {
    var returnList = []
    for (var transaction of getTransactionByUserId(userId)) {
      if (transaction.category == category) {
        returnList.push(transaction)
      }
    }
    returnList.sort((a, b) => b.cost - a.cost)
    return returnList
  }
  function getTransactionGroupbyCategoryByPeriod(userId: string, period: string) {
    const returnList: { userId: string; name: string; cost: number }[] = [];
    const categoryMap: Record<string, { userId: string; name: string; cost: number }> = {};
    for (var category of getUserById(userId)?.categories!) {
      categoryMap[category.name] = { userId, name: category.name, cost: 0}
    }
    for (const transaction of getTransactionByPeriod(userId, period)) {
      categoryMap[transaction.category].cost += transaction.cost;
    }
    for (const key in categoryMap) {
      returnList.push(categoryMap[key]);
    }
    returnList.sort((a, b) => b.cost - a.cost)
    return returnList;
  }




















  // var categoryData = [
  //   { name: 'Wife', value: 156, color: '#F97A42' }, // Orange (Wife)
  //   { name: 'Shopping', value: 89.1, color: '#04BF62' }, // Green (Shopping) 89.1
  //   { name: 'Entertainment', value: 41.4, color: '#EC4EA4' }, // Red (Entertainment) 41.4
  //   { name: 'Transport', value: 49.2, color: '#6061D6' }, // Blue (Transport) 49.2
  //   { name: 'Rent', value: 230.0, color: '#06D3E2' }, // Teal (Rent) 230
  //   { name: 'Skincare', value: 0, color: '#B1E733' }, // Yellow (Skincare) 0
  //   { name: 'Meal', value: 10, color: '#E3346E' }, // Rose (Meal) 3
    // { name: 'Wife', value: 156, color: '#F97A42' }, // Orange (Wife)
    // { name: 'Shopping', value: 89.1, color: '#04BF62' }, // Green (Shopping) 89.1
    // { name: 'Entertainment', value: 156, color: '#EC4EA4' }, // Red (Entertainment) 41.4
    // { name: 'Transport', value: 49.2, color: '#6061D6' }, // Blue (Transport) 49.2
    // { name: 'Rent', value: 230.0, color: '#06D3E2' }, // Teal (Rent) 230
    // { name: 'Skincare', value: 0, color: '#B1E733' }, // Yellow (Skincare) 0
    // { name: 'Meal', value: 4, color: '#E3346E' }, // Rose (Meal) 3
    // { name: 'Wife', value: 156, color: '#F97A42' }, // Orange (Wife)
    // { name: 'Shopping', value: 89.1, color: '#04BF62' }, // Green (Shopping) 89.1
    // { name: 'Entertainment', value: 156, color: '#EC4EA4' }, // Red (Entertainment) 41.4
    // { name: 'Transport', value: 49.2, color: '#6061D6' }, // Blue (Transport) 49.2
    // { name: 'Rent', value: 230.0, color: '#06D3E2' }, // Teal (Rent) 230
    // { name: 'Skincare', value: 0, color: '#B1E733' }, // Yellow (Skincare) 0
  // ]

  
  return {
    getUserById,
    getUserCategories,
    getCategoryColor,
    getBudgetByPeriod,
    getTransactionByUserId,
    getTransactionByCategory,
    getTransactionGroupbyCategoryByPeriod
  }

}

export default DatabaseService;