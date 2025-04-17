
export const ecoProductDictionary = {
    // Product categories
    categories: {
      "coffee_accessories": ["coffee", "pod", "mug", "cup", "thermos", "tumbler", "grinder"],
      "bags_and_accessories": ["bag", "tote", "wallet", "purse", "backpack", "handbag"],
      "kitchen_and_home": ["kitchen", "compost", "bin", "mat", "utensil", "straw", "wrap", "container"],
      "personal_care": ["soap", "toothbrush", "floss", "dental", "shampoo", "conditioner", "lotion"],
      "clothing_and_apparel": ["clothing", "shirt", "pants", "dress", "jacket", "sock", "underwear"],
      "outdoor_and_garden": ["garden", "plant", "seed", "pot", "camping", "outdoor", "furniture"],
      "pet_products": ["pet", "dog", "cat", "toy", "treat", "bed", "leash", "collar"],
      "office_supplies": ["office", "paper", "notebook", "pen", "pencil", "stapler", "organizer"]
    },
    
    // Material indicators
    materials: {
      "sustainable_materials": ["bamboo", "cork", "hemp", "jute", "organic cotton", "linen", "wool", 
                                "recycled", "upcycled", "repurposed", "compostable", "biodegradable"],
      "plastic_alternatives": ["glass", "metal", "silicone", "wood", "paper", "cardboard", "stainless steel", 
                               "ceramic", "stone", "plant fiber"],
    },
    
    // Certifications and features
    features: {
      "certifications": ["organic", "fair trade", "vegan", "cruelty-free", "B Corp", "certified", 
                         "eco-friendly", "sustainable", "green", "ethical"],
      "product_attributes": ["reusable", "zero waste", "plastic-free", "chemical-free", "natural", 
                             "handmade", "locally made", "solar", "energy-efficient", "waste-reducing"]
    },
    
    // Non-eco-product indicators (negative keywords)
    negative_indicators: {
      "infrastructure": ["traffic light", "stoplight", "signal", "street sign", "pole", "tower", 
                         "spotlight", "road", "highway", "bridge", "tunnel"],
      "vehicles": ["car", "truck", "bus", "minibus", "taxi", "cab", "trolley", "tram", "streetcar", 
                   "trolleybus", "rickshaw", "unicycle", "vehicle", "automobile", "motor"],
      "electronics": ["television", "TV", "monitor", "screen", "computer", "laptop", "phone", 
                      "electronic", "device", "gadget", "appliance"],
      "industrial": ["factory", "industrial", "machinery", "equipment", "manufacturing"]
    }
  };
  
  // List of specific eco-friendly products to detect
  export const specificProducts = [
    "reusable coffee pod", "coffee pod", "vegan leather", "tote bag", "compost bin", 
    "silk dental floss", "dental floss", "dishwashing soap", "soap bar", 
    "organic clothing", "reusable baking mat", "wallet", "pod", "floss", "soap"
  ];
  
  // Common objects in eco-product photos
  export const visualIndicators = [
    "plant", "leaf", "wood", "bamboo", "green", "recycling symbol", "earth", 
    "water", "tree", "sunlight", "garden", "nature", "cotton", "glass jar", 
    "canvas bag", "wooden utensil", "metal straw", "silicone lid"
  ];