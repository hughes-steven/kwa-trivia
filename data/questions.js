/*
 * KW AccessAbility Trivia — question bank
 *
 * This is the only file you need to edit to change the questions.
 *
 *   - Each category has a "name" and a list of "questions".
 *   - Each question has the question text ("q"), four "options", and
 *     "answer": the position of the correct option, counting from 0.
 *     (0 = A, 1 = B, 2 = C, 3 = D)
 *   - You can add or remove categories and questions freely. Keep the
 *     commas between items and the quotes around text.
 *
 * Tip: if you maintain the questions in the Excel workbook, run
 *   python3 scripts/import_xlsx.py "path/to/KWA Trivia Game.xlsm"
 * to regenerate this file from the "Database" sheet.
 */
window.KWA_TRIVIA = {
  "title": "KW AccessAbility Trivia",
  "categories": [
    {
      "name": "Current Events",
      "questions": [
        {
          "q": "Which country won the 2026 Men's FIFA World Cup by defeating Argentina in July 2026?",
          "options": ["England", "Spain", "France", "Argentina"],
          "answer": 1
        },
        {
          "q": "In August 2026, Haakon VIII became the new king of which European nation following the passing of his father?",
          "options": ["Netherlands", "Norway", "Sweden", "Denmark"],
          "answer": 1
        },
        {
          "q": "A total solar eclipse in August 2026 passed over Greenland, Iceland, Portugal, and which other European country?",
          "options": ["Germany", "Italy", "Spain", "France"],
          "answer": 2
        },
        {
          "q": "Which 2025 movie, based on a block-building video game, was one of the year's biggest box-office hits?",
          "options": ["A Minecraft Movie", "The Super Mario Bros. Movie", "Sonic the Hedgehog 4", "Tetris: The Movie"],
          "answer": 0
        },
        {
          "q": "In February 2025, which Canadian city co-hosted the Invictus Games for wounded and injured service members, alongside Whistler?",
          "options": ["Calgary", "Vancouver", "Toronto", "Halifax"],
          "answer": 1
        },
        {
          "q": "The 2026 Winter Olympics were held in Milan and Cortina d'Ampezzo, in which country?",
          "options": ["Switzerland", "Austria", "France", "Italy"],
          "answer": 3
        },
        {
          "q": "Which Canadian team played in the 2025 World Series, losing a dramatic Game 7 to the Los Angeles Dodgers?",
          "options": ["Montreal Expos", "Toronto Blue Jays", "Vancouver Canadians", "Ottawa Titans"],
          "answer": 1
        },
        {
          "q": "Which two Canadian cities hosted matches during the 2026 FIFA World Cup?",
          "options": ["Montreal and Ottawa", "Calgary and Edmonton", "Toronto and Vancouver", "Winnipeg and Halifax"],
          "answer": 2
        },
        {
          "q": "Canadian astronaut Jeremy Hansen was chosen to fly around the Moon as part of which NASA mission?",
          "options": ["Apollo 18", "Artemis II", "Orion One", "Gemini 13"],
          "answer": 1
        },
        {
          "q": "Which British rock band reunited in 2025 for their first tour in 16 years, with brothers Liam and Noel Gallagher back on stage together?",
          "options": ["Blur", "Coldplay", "Oasis", "Radiohead"],
          "answer": 2
        }
      ]
    },
    {
      "name": "Funny Stuff",
      "questions": [
        {
          "q": "In the United Kingdom, it is technically illegal under the Salmon Act 1986 to do what under suspicious circumstances?",
          "options": ["Handle a salmon", "Fish for trout", "Sell a lobster", "Eat cod on a Sunday"],
          "answer": 0
        },
        {
          "q": "Since 2005, a bylaw in Rome, Italy, has made it illegal to keep a goldfish in what?",
          "options": ["A round fishbowl", "A bathtub", "A fountain", "A teacup"],
          "answer": 0
        },
        {
          "q": "In Venice, Italy, it is illegal to feed which type of bird in St. Mark's Square?",
          "options": ["Seagulls", "Pigeons", "Sparrows", "Crows"],
          "answer": 1
        },
        {
          "q": "In Switzerland, animal welfare law makes it illegal to own just one of which pet, because they get lonely?",
          "options": ["Goldfish", "Guinea pig", "Hamster", "Budgie"],
          "answer": 1
        },
        {
          "q": "Since 1992, the sale of which everyday item has been banned in Singapore?",
          "options": ["Chewing gum", "Bubble wrap", "Plastic straws", "Whoopee cushions"],
          "answer": 0
        },
        {
          "q": "In the Australian state of Victoria, it is against the law to do what in a public place if it annoys someone?",
          "options": ["Whistle a tune", "Fly a kite", "Wear a hat", "Eat an ice cream"],
          "answer": 1
        },
        {
          "q": "On Germany's Autobahn, it is illegal to stop for which reason, which the law considers avoidable?",
          "options": ["Taking a photo", "Running out of fuel", "Sneezing", "Changing the radio station"],
          "answer": 1
        },
        {
          "q": "Under Canada's Currency Act, a shopkeeper can legally refuse a payment made entirely in pennies if it is more than what amount?",
          "options": ["25 cents", "1 dollar", "5 dollars", "20 dollars"],
          "answer": 0
        },
        {
          "q": "Since 2009, visitors to ancient monuments in Greece such as the Acropolis have been banned from wearing what?",
          "options": ["Sunglasses", "Hats", "High heels", "Shorts"],
          "answer": 2
        },
        {
          "q": "In Denmark, parents must choose their baby's name from what?",
          "options": ["A list of about 7,000 approved names", "The names of Danish royalty", "A list drawn up by the town mayor", "Names of Viking gods"],
          "answer": 0
        }
      ]
    },
    {
      "name": "Animals",
      "questions": [
        {
          "q": "Octopuses are famously unique creatures, but how many hearts do they actually possess to pump blood through their bodies?",
          "options": ["1", "2", "3", "4"],
          "answer": 2
        },
        {
          "q": "What do sea otters do while sleeping to keep from drifting apart in the water?",
          "options": ["Hold hands", "Tie themselves together with kelp", "Sleep on top of each other's backs", "Bite onto each other's tails"],
          "answer": 0
        },
        {
          "q": "What colour are flamingos when they first hatch from their eggs?",
          "options": ["Bright pink", "Gray or white", "Jet black", "Neon orange"],
          "answer": 1
        },
        {
          "q": "What is the name for a group of flamingos?",
          "options": ["A parade", "A flamboyance", "A blush", "A pinkening"],
          "answer": 1
        },
        {
          "q": "Where in its body is a shrimp's heart located?",
          "options": ["In its tail", "In its head", "In its legs", "Shrimp have no heart"],
          "answer": 1
        },
        {
          "q": "Which animal has fingerprints so similar to a human's that they could confuse a crime scene investigator?",
          "options": ["Chimpanzee", "Raccoon", "Koala", "Sloth"],
          "answer": 2
        },
        {
          "q": "Which is the only bird that can truly fly backwards?",
          "options": ["Hummingbird", "Sparrow", "Owl", "Kingfisher"],
          "answer": 0
        },
        {
          "q": "A giraffe's neck can be almost two metres long. How many neck bones (vertebrae) does it have?",
          "options": ["7, the same as a human", "14", "21", "35"],
          "answer": 0
        },
        {
          "q": "Honeybees tell their hive-mates where to find flowers by performing what?",
          "options": ["A humming song", "The waggle dance", "A pollen puppet show", "A figure-eight flight over the hive"],
          "answer": 1
        },
        {
          "q": "Which part of a dog is unique to each animal, much like a human fingerprint?",
          "options": ["Its tongue", "Its nose print", "Its tail", "Its paw pads"],
          "answer": 1
        }
      ]
    },
    {
      "name": "Food",
      "questions": [
        {
          "q": "Which popular Italian cheese is historically and traditionally made from the milk of water buffalo?",
          "options": ["Parmigiano-Reggiano", "Gorgonzola", "Mozzarella", "Provolone"],
          "answer": 2
        },
        {
          "q": "What gives the green paste known as wasabi its signature fiery, sinus-clearing heat?",
          "options": ["Capsaicin", "Allyl isothiocyanate", "Piperine", "Scoville acid"],
          "answer": 1
        },
        {
          "q": "What type of food is a \"Scouse\", which gave the people of Liverpool, England, their famous nickname?",
          "options": ["A type of meat stew", "A sweet, layered pastry", "A deep-fried seafood dish", "A savoury potato pancake"],
          "answer": 0
        },
        {
          "q": "Which food, found still edible in 3,000-year-old Egyptian tombs, essentially never spoils?",
          "options": ["Olive oil", "Honey", "Dried beans", "Cheese"],
          "answer": 1
        },
        {
          "q": "In the 1830s, which popular condiment was sold in the United States as a medicine?",
          "options": ["Mustard", "Mayonnaise", "Ketchup", "Relish"],
          "answer": 2
        },
        {
          "q": "Despite the name, a peanut is not actually a nut. What is it?",
          "options": ["A seed of a berry", "A legume, like peas and beans", "A root vegetable", "A type of grain"],
          "answer": 1
        },
        {
          "q": "Hawaiian pizza, topped with ham and pineapple, was invented in 1962 in which country?",
          "options": ["United States", "Italy", "Australia", "Canada"],
          "answer": 3
        },
        {
          "q": "Before the 17th century, most carrots grown in Europe were which colour?",
          "options": ["Orange", "Purple", "Blue", "Pink"],
          "answer": 1
        },
        {
          "q": "According to botanists, which of these is technically a berry?",
          "options": ["Strawberry", "Raspberry", "Banana", "Blackberry"],
          "answer": 2
        },
        {
          "q": "Which ingredient found in milk and dark chocolate is missing from white chocolate?",
          "options": ["Cocoa butter", "Cocoa solids", "Sugar", "Milk"],
          "answer": 1
        }
      ]
    },
    {
      "name": "Entertainment",
      "questions": [
        {
          "q": "Which 1995 movie was the first feature-length film to be entirely computer-animated?",
          "options": ["Toy Story", "A Bug's Life", "Shrek", "Monsters, Inc."],
          "answer": 0
        },
        {
          "q": "Who is the most nominated actor or actress in Academy Awards history, with 21 nominations?",
          "options": ["Katharine Hepburn", "Jack Nicholson", "Meryl Streep", "Bette Davis"],
          "answer": 2
        },
        {
          "q": "Which iconic rock band released the best-selling album 'The Dark Side of the Moon' in 1973?",
          "options": ["The Beatles", "Pink Floyd", "Led Zeppelin", "Queen"],
          "answer": 1
        },
        {
          "q": "Which 2009 film directed by James Cameron is the highest-grossing movie of all time?",
          "options": ["Titanic", "Avatar", "Avengers: Endgame", "Jurassic World"],
          "answer": 1
        },
        {
          "q": "Which 2008 film was the very first movie in the Marvel Cinematic Universe?",
          "options": ["The Incredible Hulk", "Captain America", "Iron Man", "Thor"],
          "answer": 2
        },
        {
          "q": "Who played Jack Dawson opposite Kate Winslet in the 1997 film 'Titanic'?",
          "options": ["Brad Pitt", "Matt Damon", "Johnny Depp", "Leonardo DiCaprio"],
          "answer": 3
        },
        {
          "q": "In the 1939 film 'The Wizard of Oz', what colour are Dorothy's magic slippers?",
          "options": ["Silver", "Ruby red", "Emerald green", "Gold"],
          "answer": 1
        },
        {
          "q": "Which Canadian actor from Vancouver plays the wisecracking superhero Deadpool?",
          "options": ["Ryan Reynolds", "Ryan Gosling", "Seth Rogen", "Keanu Reeves"],
          "answer": 0
        },
        {
          "q": "In the summer of 2023, which film's release on the same day as 'Oppenheimer' created the 'Barbenheimer' craze?",
          "options": ["The Little Mermaid", "Barbie", "Mission: Impossible", "Indiana Jones"],
          "answer": 1
        },
        {
          "q": "In 'The Lord of the Rings' films, what is the name of the hobbit played by Elijah Wood who carries the ring?",
          "options": ["Samwise Gamgee", "Bilbo Baggins", "Frodo Baggins", "Pippin Took"],
          "answer": 2
        }
      ]
    },
    {
      "name": "Sports",
      "questions": [
        {
          "q": "How many players are on the field for one team during a standard soccer (football) match?",
          "options": ["9", "10", "12", "11"],
          "answer": 3
        },
        {
          "q": "Which country won the FIFA World Cup in 2022?",
          "options": ["Croatia", "Argentina", "Brazil", "France"],
          "answer": 1
        },
        {
          "q": "In golf, what term is used to describe scoring two strokes under par on a single hole?",
          "options": ["Eagle", "Birdie", "Albatross", "Bogey"],
          "answer": 0
        },
        {
          "q": "How many interlocking rings appear on the Olympic flag?",
          "options": ["4", "5", "6", "7"],
          "answer": 1
        },
        {
          "q": "Which Canadian city hosted the 2010 Winter Olympic Games?",
          "options": ["Calgary", "Montreal", "Vancouver", "Toronto"],
          "answer": 2
        },
        {
          "q": "James Naismith, the inventor of basketball, was born in which country?",
          "options": ["United States", "Scotland", "Canada", "England"],
          "answer": 2
        },
        {
          "q": "Which NHL team has won the most Stanley Cup championships?",
          "options": ["Toronto Maple Leafs", "Montreal Canadiens", "Detroit Red Wings", "Boston Bruins"],
          "answer": 1
        },
        {
          "q": "In tennis, what word is used for a score of zero?",
          "options": ["Nil", "Duck", "Love", "Blank"],
          "answer": 2
        },
        {
          "q": "How many holes are there on a standard, full-size golf course?",
          "options": ["9", "12", "18", "24"],
          "answer": 2
        },
        {
          "q": "Which jersey number did hockey legend Wayne Gretzky wear, now retired across the entire NHL?",
          "options": ["9", "66", "87", "99"],
          "answer": 3
        }
      ]
    },
    {
      "name": "Television",
      "questions": [
        {
          "q": "What is the name of the fictional coffee shop where the characters frequently gather in the sitcom 'Friends'?",
          "options": ["MacLaren's Pub", "Monique's", "Central Perk", "The Bean Scene"],
          "answer": 2
        },
        {
          "q": "How many seasons did the hit fantasy drama series 'Game of Thrones' run for?",
          "options": ["6", "9", "7", "8"],
          "answer": 3
        },
        {
          "q": "In the American mockumentary sitcom 'The Office', what is the name of the paper company where the characters work?",
          "options": ["Wernham Hogg", "Initech", "Saber", "Dunder Mifflin"],
          "answer": 3
        },
        {
          "q": "Which animated family from Springfield stars in the longest-running scripted TV series in American history?",
          "options": ["The Flintstones", "The Simpsons", "The Griffins", "The Jetsons"],
          "answer": 1
        },
        {
          "q": "Which Canadian sitcom follows the wealthy Rose family after they lose their fortune and move to a small town they once bought as a joke?",
          "options": ["Corner Gas", "Kim's Convenience", "Schitt's Creek", "Letterkenny"],
          "answer": 2
        },
        {
          "q": "Longtime 'Jeopardy!' host Alex Trebek was born in which Ontario city?",
          "options": ["Kitchener", "Sudbury", "Thunder Bay", "Kingston"],
          "answer": 1
        },
        {
          "q": "In 'The Big Bang Theory', what is Sheldon Cooper's catchphrase after he pulls a prank?",
          "options": ["Gotcha!", "Bazinga!", "Boom!", "Psych!"],
          "answer": 1
        },
        {
          "q": "The Canadian sitcom 'Corner Gas' is set in which fictional Saskatchewan town?",
          "options": ["Moose Hollow", "Dog River", "Wheat Ridge", "Prairie Bend"],
          "answer": 1
        },
        {
          "q": "In 'Seinfeld', what is the first name of Jerry's eccentric neighbour, Kramer?",
          "options": ["Cosmo", "Casper", "Carl", "Chester"],
          "answer": 0
        },
        {
          "q": "The Netflix series 'Stranger Things' is set in which fictional Indiana town?",
          "options": ["Derry", "Hawkins", "Riverdale", "Pawnee"],
          "answer": 1
        }
      ]
    },
    {
      "name": "Music",
      "questions": [
        {
          "q": "Which pop star's fans are affectionately known as 'Swifties'?",
          "options": ["Taylor Swift", "Ariana Grande", "Billie Eilish", "Beyoncé"],
          "answer": 0
        },
        {
          "q": "What was the title of Michael Jackson's 1982 album that became the best-selling album of all time?",
          "options": ["Dangerous", "Off the Wall", "Bad", "Thriller"],
          "answer": 3
        },
        {
          "q": "How many strings are traditionally found on a standard bass guitar?",
          "options": ["6", "4", "12", "5"],
          "answer": 1
        },
        {
          "q": "Which Canadian singer had a worldwide hit in 2012 with 'Call Me Maybe'?",
          "options": ["Avril Lavigne", "Carly Rae Jepsen", "Alessia Cara", "Shania Twain"],
          "answer": 1
        },
        {
          "q": "Which Toronto-born rapper released the hit songs 'Hotline Bling' and 'God's Plan'?",
          "options": ["The Weeknd", "Justin Bieber", "Drake", "Kardinal Offishall"],
          "answer": 2
        },
        {
          "q": "The Beatles came from which English city?",
          "options": ["London", "Manchester", "Birmingham", "Liverpool"],
          "answer": 3
        },
        {
          "q": "Which instrument has 88 keys?",
          "options": ["Accordion", "Piano", "Organ", "Harpsichord"],
          "answer": 1
        },
        {
          "q": "Which Quebec-born singer performed 'My Heart Will Go On', the theme from 'Titanic'?",
          "options": ["Celine Dion", "Sarah McLachlan", "Anne Murray", "k.d. lang"],
          "answer": 0
        },
        {
          "q": "Which singer is known as the 'Queen of Pop'?",
          "options": ["Cher", "Whitney Houston", "Madonna", "Lady Gaga"],
          "answer": 2
        },
        {
          "q": "Freddie Mercury was the lead singer of which band, famous for 'Bohemian Rhapsody'?",
          "options": ["The Rolling Stones", "Queen", "The Who", "Fleetwood Mac"],
          "answer": 1
        }
      ]
    },
    {
      "name": "Slogans & Sayings",
      "questions": [
        {
          "q": "What does the idiom 'barking up the wrong tree' mean?",
          "options": ["Pursuing a mistaken line of thought or course of action", "Complaining about noisy neighbours", "Climbing trees to get a better view", "Taking care of someone else's pet"],
          "answer": 0
        },
        {
          "q": "If someone tells you to 'bite the bullet', what are they asking you to do?",
          "options": ["Eat something very quickly before a deadline", "Stop talking immediately and listen closely", "Chew something crunchy as fast as you can", "Face a painful situation with courage and get it over with"],
          "answer": 3
        },
        {
          "q": "What is the meaning of the idiom 'spill the beans'?",
          "options": ["Make a messy mistake while cooking", "Reveal a secret, often unintentionally", "Organize a community garden project", "Waste valuable grocery money"],
          "answer": 1
        },
        {
          "q": "If an actor is told to 'break a leg' before a show, what is being wished for them?",
          "options": ["A short performance", "Good luck", "A quick recovery", "A dramatic fall scene"],
          "answer": 1
        },
        {
          "q": "If something 'costs an arm and a leg', what does that mean?",
          "options": ["It is very expensive", "It is dangerous to buy", "It was paid for in instalments", "It is a medical bill"],
          "answer": 0
        },
        {
          "q": "How often does something happen if it happens 'once in a blue moon'?",
          "options": ["Every night", "Once a month", "Very rarely", "Only in winter"],
          "answer": 2
        },
        {
          "q": "What is someone about to do if they say they are going to 'hit the hay'?",
          "options": ["Start farming", "Go to bed", "Get angry", "Go for a run"],
          "answer": 1
        },
        {
          "q": "If a task is 'a piece of cake', what is it?",
          "options": ["Delicious", "Very easy", "Sweet but unhealthy", "Something to share"],
          "answer": 1
        },
        {
          "q": "What does it mean to feel 'under the weather'?",
          "options": ["To be caught in the rain", "To feel slightly unwell", "To be cold", "To be worried about a storm"],
          "answer": 1
        },
        {
          "q": "If it is 'raining cats and dogs', what is the weather doing?",
          "options": ["Snowing lightly", "Raining very heavily", "Hailing", "Clearing up"],
          "answer": 1
        }
      ]
    },
    {
      "name": "Miscellaneous",
      "questions": [
        {
          "q": "What is the official capital city of Canada?",
          "options": ["Vancouver", "Toronto", "Ottawa", "Montreal"],
          "answer": 2
        },
        {
          "q": "Which animal is an official national symbol of Canada and is featured on the Canadian five-cent coin?",
          "options": ["Polar bear", "Grizzly bear", "Moose", "Beaver"],
          "answer": 3
        },
        {
          "q": "How many provinces are there in Canada?",
          "options": ["12", "13", "50", "10"],
          "answer": 3
        },
        {
          "q": "Canada has two official national sports. Lacrosse is the summer sport. What is the winter sport?",
          "options": ["Curling", "Ice hockey", "Figure skating", "Skiing"],
          "answer": 1
        },
        {
          "q": "Which is Canada's largest province by land area?",
          "options": ["Ontario", "British Columbia", "Quebec", "Alberta"],
          "answer": 2
        },
        {
          "q": "In addition to its provinces, how many territories does Canada have?",
          "options": ["1", "2", "3", "4"],
          "answer": 2
        },
        {
          "q": "What are Canada's two official languages?",
          "options": ["English and Spanish", "English and French", "French and Inuktitut", "English and Cree"],
          "answer": 1
        },
        {
          "q": "What is the nickname of the Canadian one-dollar coin?",
          "options": ["Toonie", "Beaver buck", "Loonie", "Maple"],
          "answer": 2
        },
        {
          "q": "Which Ontario community hosts a famous Oktoberfest, billed as the largest Bavarian festival outside of Germany?",
          "options": ["Kitchener-Waterloo", "London", "Hamilton", "Windsor"],
          "answer": 0
        },
        {
          "q": "What is the capital city of the province of Ontario?",
          "options": ["Ottawa", "Kitchener", "Toronto", "Hamilton"],
          "answer": 2
        }
      ]
    }
  ]
};
