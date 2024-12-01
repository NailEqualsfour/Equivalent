function DatabaseService() {

  var users = [
    { 
      userId: '6d40f748dd1d8bbe', // Mine
      categories: [
        { name: 'Wife', color: '#F97A42', position: 0 },
        { name: 'Entertainment', color: '#EC4EA4', position: 1 },
        { name: 'Skincare', color: '#B1E733', position: 2 },
        { name: 'Transport', color: '#6061D6', position: 4 },
        { name: 'Rent', color: '#06D3E2', position: 5 },
        { name: 'Shopping', color: '#04BF62', position: 6 },
        { name: 'Meal', color: '#E3346E', position: 7 }
      ]
    },
    { 
      userId: '12138508123cda2f', // Caro
      categories: [
        { name: 'Transport', color: 'white', position: 0 },
        { name: 'Shopping', color: 'black', position: 1 },
        { name: 'Meal', color: '#E3346E', position: 2 }
      ]
    } 
  ]

  var transactions = [
    { userId: '6d40f748dd1d8bbe', category: 'Wife', cost: 2.1, name: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Wife', cost: 100, name: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Rent', cost: 230, name: 'First rent at mama house' },
    { userId: '6d40f748dd1d8bbe', category: 'Transport', cost: 49.20, name: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Entertainment', cost: 41.40, name: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Wife', cost: 54, name: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Meal', cost: 10, name: '' },
    { userId: '12138508123cda2f', category: 'Skincare', cost: 100, name: '' },
    { userId: '12138508123cda2f', category: 'Skincare', cost: 50, name: '' },
    { userId: '6d40f748dd1d8bbe', category: 'Skincare', cost: 2, name: '' }, 
  ]




  //User Functions
  function getUserById(id: string) { // Backend Query when connected to Supabase
    for (var user of users) {
      if (user.userId == id) {
        return user
      }
    }
  }
  function getCategoryColor(userId: string, category: string) {
    for (var categoryItem of getUserById(userId)?.categories!) {
      if (categoryItem.name == category) {
        return categoryItem.color
      }
    }
    return 'black'
  }



  //TransactionFunctions
  function getTransactionByUserId(id: string) {
    var returnList = []
    for (var transaction of transactions) {
      if (transaction.userId == id) {
        returnList.push(transaction)
      }
    }
    return returnList
  }
  function getTransactionByCategory(userId: string, category: string) {
    var returnList = []
    for (var transaction of getTransactionByUserId(userId)) {
      if (transaction.category == category) {
        returnList.push(transaction)
      }
    }
    return returnList
  }
  function getTransactionGroupbyCategory(userId: string) {
    const returnList: { userId: string; name: string; cost: number }[] = [];
    const categoryMap: Record<string, { userId: string; name: string; cost: number }> = {};
    for (const transaction of getTransactionByUserId(userId)) {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = { userId, name: transaction.category, cost: 0 };
      }
      categoryMap[transaction.category].cost += transaction.cost;
    }
    for (const key in categoryMap) {
      returnList.push(categoryMap[key]);
    }
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
    getCategoryColor,
    getTransactionByUserId,
    getTransactionByCategory,
    getTransactionGroupbyCategory
  }

}

export default DatabaseService;