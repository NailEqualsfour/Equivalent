function DatabaseService() {
  var users = [
    { 
      deviceId: '6d40f748dd1d8bbe', // Mine
      categories: [
        { name: 'Wife', color: '#F97A42', position: 0 },
        { name: 'Entertainment', color: '#EC4EA4', position: 1 },
        { name: 'Skincare', color: '#B1E733', position: 2 },
        { name: 'Transport', color: '#6061D6', position: 4 },
        { name: 'Rent', color: '#B1E733', position: 5 },
        { name: 'Shopping', color: '#04BF62', position: 6 },
        { name: 'Meal', color: '#E3346E', position: 7 }
      ]
    },

    { 
      deviceId: '12138508123cda2f', // Caro
      categories: [
        { name: 'Transport', color: 'white', position: 0 },
        { name: 'Shopping', color: 'black', position: 1 },
        { name: 'Meal', color: '#E3346E', position: 2 }
      ]
    } 
  ]
  function getUserById(id: string) { // Backend Query when connected to Supabase
    for (var user of users) {
      if (user.deviceId == id) {
        return user
      }
    }
  }

  var categoryData = [
    { name: 'Wife', value: 156, color: '#F97A42' }, // Orange (Wife)
    { name: 'Shopping', value: 89.1, color: '#04BF62' }, // Green (Shopping) 89.1
    { name: 'Entertainment', value: 41.4, color: '#EC4EA4' }, // Red (Entertainment) 41.4
    { name: 'Transport', value: 49.2, color: '#6061D6' }, // Blue (Transport) 49.2
    { name: 'Rent', value: 230.0, color: '#06D3E2' }, // Teal (Rent) 230
    { name: 'Skincare', value: 0, color: '#B1E733' }, // Yellow (Skincare) 0
    { name: 'Meal', value: 10, color: '#E3346E' }, // Rose (Meal) 3
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
  ]
  function getCategoryData() {
    return categoryData
  }
  
  return {
    getUserById,
    getCategoryData
  }

}

export default DatabaseService;