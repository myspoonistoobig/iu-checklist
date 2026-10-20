// The Sure Stay cleaning checklist, in order.
// To edit: change, add, or remove lines below, then bump VERSION in sw.js so phones pick up the change.
// A checkmark is remembered by its section + exact wording, so editing an item's text unchecks it.
//
// Entry types:
//   { divider: 'Text' }                                  a full-width break (Lunch, Second Floor, Finish Up)
//   { id, title, note?, items: ['...', ...] }            a section of checkable items
//   An item can be a string, or { text, note } to add a smaller reminder line under it.

window.CHECKLIST = [
  {
    id: 'pool', title: 'Pool Area',
    items: [
      'Get mop, bucket, and wet floor signs',
      'Collect wet pool towels and replace with clean ones',
      'Sweep the entire pool area and bathroom',
      { text: 'Empty the three trash cans and replace bags', note: 'One is in the bathroom' },
      { text: 'Clean the bathroom', note: 'Follow the same steps as the lobby bathrooms' },
    ],
  },
  {
    id: 'back-hall', title: 'Back Hallway by Pool',
    items: [
      { text: 'Wipe down glass on both sides of doors with clear vinegar water spray', note: '2 doors in hallway and the pool door' },
      'Sweep hallway and steps and vacuum rugs',
      'Empty trash and reline if ½ full or has an odor',
      'Dust stairwells and doorways',
      { text: 'Mop hallway (also do steps if needed)', note: 'Put a wet floor sign in the hall' },
    ],
  },
  {
    id: 'fitness', title: 'Fitness Center',
    items: [
      'Wipe down glass on both sides of doors with clear vinegar water spray',
      'Empty trash and replace bag',
      'Refill plastic cups',
      'Gather used towels and replace clean ones on the shelf',
      'Spray equipment and AC unit with the (yellow) Neutra-Clean bottle',
    ],
  },
  {
    id: 'laundry', title: 'Guest Laundry',
    items: [
      'Wipe down glass on both sides of doors with vinegar water spray',
      'Use the (yellow) Neutra-Clean bottle to spray and clean out washers and dryers',
      'Empty dryer lint',
      'Use the (yellow) Neutra-Clean bottle to wipe down the counter',
      'Empty trash and reline trash bag',
      { text: 'Sweep and mop floor', note: 'Put a wet floor sign down' },
    ],
  },
  {
    id: 'vending-1', title: 'Vending', note: 'Candy, soda, and ice machine',
    items: [
      'Dust the tops of the machines',
      'Wipe with the (yellow) Neutra-Clean bottle',
      'Vacuum from the entrance to the lobby to the area right past the bathrooms in the hallway AND the Business Center',
    ],
  },
  {
    id: 'business', title: 'Business Center and Center Stairwell',
    items: [
      'Spray all-purpose cleaner on a rag and wipe down table top area, monitor edge, tops of keyboard and printer, and chairs',
      'Dust stairwell',
      'Empty trash at top of stairwell and replace with a new bag',
    ],
  },
  {
    id: 'lobby-bath', title: 'Lobby Bathrooms', note: 'Park cart along the wall at the bathrooms to allow passage',
    items: [
      { text: 'WEAR GLOVES: Spray Tile Brite on sink, toilet, and urinal', note: 'Let it sit. Lift the toilet seat and squeeze Clorox (red cap) into the toilet and urinal.' },
      'Spray the mirror with vinegar water and wipe with a clean rag',
      { text: 'Use a clean rag to wipe down the sink first, then the toilet, then the urinal', note: 'Toilet: all areas, around the seat, under the seat, and around the bottom' },
      { text: 'Use Clorox (red cap) to scrub the inside of the toilet and urinal', note: 'Use the rag to prevent dripping. Return the toilet brush and put the dirty rag in the black bag.' },
      { text: 'Refill toilet paper if getting low', note: 'More is on the cart' },
      'Empty trash',
      { text: 'Sweep floors, then mop them', note: 'Put wet floor signs in front of each door' },
      'Let the head housekeeper know if soap or paper towels are low',
    ],
  },
  {
    id: 'before-lunch', title: 'Before Lunch',
    items: [
      { text: 'Take trash from the laundry room to the dumpster', note: 'There’s a separate dumpster for trash and cardboard' },
    ],
  },
  { divider: 'Lunch · 30 minutes' },
  {
    id: 'lobby', title: 'Lobby',
    items: [
      { text: 'Use the (yellow) Neutra-Clean bottle to wipe down coffee counter, mantle, and wood tables', note: 'Use vinegar spray to wipe off the round glass tables' },
      'Empty trash at entrance and by coffee, replace bag',
      'Vacuum rugs',
      { text: 'Sweep lobby, then mop', note: 'Put down 3 wet floor signs' },
    ],
  },
  {
    id: 'far-side', title: 'Far Side Entrance',
    items: [
      { text: 'Wipe down glass on both sides of doors with vinegar water spray', note: 'Door in hallway and outside door' },
      'Sweep hallway and steps and vacuum rugs',
      'Empty trash and reline if ½ full or has an odor',
      'Dust stairwells',
      { text: 'Mop hallway and steps if needed', note: 'Put a wet floor sign in the hall' },
    ],
  },
  {
    id: 'end-hall-1', title: 'End Hallway',
    items: [
      'Clean large window with vinegar water and dust for cobwebs',
      { text: 'Mop hallway', note: 'Put a wet floor sign down' },
    ],
  },
  { divider: 'Second Floor' },
  {
    id: 'vending-2', title: 'Vending', note: 'Candy, soda, and ice machine',
    items: [
      'Dust the tops of the machines',
      'Wipe with the (yellow) Neutra-Clean bottle',
      'Vacuum from the vending machines to the stairwell door',
    ],
  },
  {
    id: 'end-hall-2', title: 'End Hallway',
    items: [
      { text: 'Mop hallway', note: 'Put a wet floor sign down' },
    ],
  },
  { divider: 'Finish Up' },
  {
    id: 'cart', title: 'Cart',
    items: [
      'Refill solutions and supplies if needed, such as toilet paper',
      'Empty trash and replace with a clean bag',
      'Take dirty rags to the laundry room wash',
      'Fill bag with clean rags and hang a new black bag for dirty rags',
    ],
  },
  {
    id: 'mop', title: 'Mop and Bucket',
    items: [
      'Dump dirty water in the laundry room sink, then rinse out the bucket and sink',
      'Put dirty mop heads in the brown basket beside the washers and return the handle to the wall',
      'Wipe up any dripped or spilled water from the floor',
    ],
  },
];
