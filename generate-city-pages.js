#!/usr/bin/env node
/**
 * generate-city-pages.js
 * Generates service landing pages for 100 cities near Worcester, MA.
 * Run: node generate-city-pages.js
 */

const fs = require('fs');
const path = require('path');

// ─── CITIES ───────────────────────────────────────────────────────────────────
const cities = [
  { name: 'Worcester', pop: 206518, desc: 'the Heart of the Commonwealth', landmark: 'home to the Worcester Art Museum and a thriving downtown revitalization' },
  { name: 'Boston', pop: 675647, desc: 'Massachusetts\' capital city', landmark: 'known for its historic Freedom Trail, world-class universities, and bustling innovation economy' },
  { name: 'Springfield', pop: 155929, desc: 'the birthplace of basketball', landmark: 'anchored by the Basketball Hall of Fame and a growing creative economy along the Connecticut River' },
  { name: 'Framingham', pop: 72362, desc: 'a dynamic MetroWest hub', landmark: 'featuring Shoppers World, vibrant Brazilian and Latin American communities, and rapid commercial growth' },
  { name: 'Lowell', pop: 115554, desc: 'the Cradle of the Industrial Revolution', landmark: 'where historic mill architecture meets a diverse, entrepreneurial community along the Merrimack River' },
  { name: 'Cambridge', pop: 118403, desc: 'the global epicenter of innovation', landmark: 'home to Harvard, MIT, and Kendall Square\'s world-renowned biotech corridor' },
  { name: 'New Bedford', pop: 101079, desc: 'the Whaling City', landmark: 'with a storied maritime heritage, the Whaling National Historical Park, and a growing arts district' },
  { name: 'Brockton', pop: 105643, desc: 'the City of Champions', landmark: 'known for its proud boxing legacy and a rapidly diversifying business landscape' },
  { name: 'Quincy', pop: 101636, desc: 'the City of Presidents', landmark: 'birthplace of John Adams and John Quincy Adams, with a booming waterfront development scene' },
  { name: 'Lynn', pop: 101253, desc: 'the City of Firsts', landmark: 'featuring the beautiful Lynn Shore Reservation and a resurging downtown creative district' },
  { name: 'Fall River', pop: 93885, desc: 'the Scholarship City', landmark: 'where Battleship Cove and historic granite-mill architecture define the waterfront skyline' },
  { name: 'Newton', pop: 88923, desc: 'one of the most desirable suburbs in America', landmark: 'celebrated for top-rated schools, leafy neighborhoods, and a sophisticated village-center economy' },
  { name: 'Lawrence', pop: 89143, desc: 'the Immigrant City', landmark: 'with deep Dominican and Latino roots, the Bread and Roses heritage, and a surging small-business corridor' },
  { name: 'Waltham', pop: 62227, desc: 'Watch City', landmark: 'home to Brandeis University and a thriving Route 128 tech corridor' },
  { name: 'Malden', pop: 66263, desc: 'a vibrant city north of Boston', landmark: 'known for its diverse restaurant scene, strong transit access, and a tight-knit business community' },
  { name: 'Medford', pop: 63896, desc: 'home to Tufts University', landmark: 'featuring the beautiful Mystic River Reservation and a walkable, family-friendly downtown' },
  { name: 'Taunton', pop: 59559, desc: 'the Silver City', landmark: 'rich in Colonial history with the Taunton Green and a growing commercial base in southeastern Massachusetts' },
  { name: 'Chicopee', pop: 55298, desc: 'the Crossroads of New England', landmark: 'strategically located at the junction of I-90 and I-91 with Westover Air Reserve Base nearby' },
  { name: 'Weymouth', pop: 57746, desc: 'a South Shore community with colonial roots', landmark: 'offering scenic coastal living along the Back River and Fore River waterfronts' },
  { name: 'Revere', pop: 62786, desc: 'home of America\'s first public beach', landmark: 'where the iconic Revere Beach boulevard meets a booming residential and dining district' },
  { name: 'Peabody', pop: 54070, desc: 'the Leather City', landmark: 'featuring Northshore Mall and a welcoming business community on the North Shore' },
  { name: 'Methuen', pop: 50706, desc: 'a family-oriented Merrimack Valley town', landmark: 'where the historic Searles Castle and vibrant Loop district attract residents and visitors alike' },
  { name: 'Barnstable', pop: 44641, desc: 'the gateway to Cape Cod', landmark: 'spanning Hyannis\' bustling Main Street to Sandy Neck\'s pristine dunes' },
  { name: 'Pittsfield', pop: 42142, desc: 'the cultural heart of the Berkshires', landmark: 'home to the Berkshire Museum and surrounded by world-class performing arts venues' },
  { name: 'Attleboro', pop: 46699, desc: 'the Jewelry Capital of the World', landmark: 'with a storied manufacturing heritage and a revitalized downtown along the MBTA commuter rail' },
  { name: 'Somerville', pop: 81045, desc: 'one of the densest and most diverse cities in New England', landmark: 'where Davis Square\'s eclectic culture meets Assembly Row\'s modern waterfront development' },
  { name: 'Everett', pop: 49781, desc: 'a resurgent city on the Mystic River', landmark: 'experiencing a renaissance with Encore Boston Harbor and major transit-oriented development' },
  { name: 'Salem', pop: 44480, desc: 'the Witch City', landmark: 'world-famous for its 1692 history, the Peabody Essex Museum, and a year-round tourism economy' },
  { name: 'Westfield', pop: 41680, desc: 'the Whip City', landmark: 'nestled along the Westfield River with Barnes Airport and a strong local manufacturing tradition' },
  { name: 'Leominster', pop: 43782, desc: 'the Pioneer Plastics City', landmark: 'known for Johnny Appleseed heritage and a robust industrial park along Route 2' },
  { name: 'Fitchburg', pop: 40908, desc: 'a gritty, creative North Central Massachusetts city', landmark: 'home to Fitchburg State University and Rollstone Hill\'s panoramic views' },
  { name: 'Holyoke', pop: 38280, desc: 'the Paper City', landmark: 'featuring an iconic canal system, the Volleyball Hall of Fame, and a growing Puerto Rican cultural district' },
  { name: 'Beverly', pop: 42670, desc: 'the Garden City', landmark: 'offering the North Shore Music Theatre, beautiful Dane Street Beach, and a charming downtown' },
  { name: 'Marlborough', pop: 41793, desc: 'a booming I-495 tech-corridor city', landmark: 'where a walkable downtown coexists with major corporate campuses and data centers' },
  { name: 'Woburn', pop: 40512, desc: 'a commercial powerhouse north of Boston', landmark: 'home to major retail and business parks along the I-93/I-95 interchange' },
  { name: 'Chelsea', pop: 40097, desc: 'one of the most diverse small cities in America', landmark: 'with the Market Basket hub, stunning waterfront views of Boston, and a proud immigrant community' },
  { name: 'Braintree', pop: 39867, desc: 'a thriving South Shore community', landmark: 'anchored by South Shore Plaza and excellent Red Line commuter rail access' },
  { name: 'Shrewsbury', pop: 39325, desc: 'a top-rated suburb west of Worcester', landmark: 'valued for excellent schools, Lake Quinsigamond shoreline, and a growing commercial tax base' },
  { name: 'Natick', pop: 36522, desc: 'home to one of the largest malls in New England', landmark: 'where the Natick Collection meets beautiful Lake Cochituate State Park' },
  { name: 'Milford', pop: 30000, desc: 'a bustling town on the I-495 corridor', landmark: 'with a historic downtown, a strong Italian-American heritage, and proximity to major highways' },
  { name: 'Grafton', pop: 19818, desc: 'a scenic Worcester County town', landmark: 'featuring rolling farmland, Hassanamesit Woods, and the birthplace of the American Antiquarian Society press' },
  { name: 'Auburn', pop: 16685, desc: 'Worcester\'s western neighbor', landmark: 'where the Yankee Drummer Inn heritage meets modern retail along Route 12' },
  { name: 'Oxford', pop: 13866, desc: 'a quintessential small New England town', landmark: 'known for its charming center, French River Trail, and close-knit community spirit' },
  { name: 'Webster', pop: 16767, desc: 'home to Lake Chargoggagoggmanchauggagoggchaubunagungamaugg', landmark: 'featuring the lake with the longest place name in the US and Indian Ranch entertainment venue' },
  { name: 'Southbridge', pop: 16832, desc: 'a gateway to the Sturbridge area', landmark: 'with rich French-Canadian heritage, the Quinebaug River, and a revitalizing Main Street corridor' },
  { name: 'Sturbridge', pop: 9573, desc: 'famous for Old Sturbridge Village', landmark: 'where living-history tourism meets the intersection of I-84 and I-90' },
  { name: 'Spencer', pop: 11880, desc: 'a rural Worcester County town', landmark: 'known for Spencer Fair, Howe State Park, and a strong agricultural tradition' },
  { name: 'Holden', pop: 19596, desc: 'a desirable residential community north of Worcester', landmark: 'offering Wachusett Reservoir views, top schools, and the Holden Arboretum' },
  { name: 'Rutland', pop: 9076, desc: 'the geographic center of Massachusetts', landmark: 'marked by a monument at the state\'s exact center and surrounded by scenic farmland' },
  { name: 'Paxton', pop: 4897, desc: 'a quiet, residential community near Worcester', landmark: 'featuring Moore State Park with its historic sawmill and beautiful seasonal gardens' },
  { name: 'Leicester', pop: 11342, desc: 'a historic Worcester County town', landmark: 'with Becker College roots, scenic Moose Hill, and a strong community identity' },
  { name: 'Millbury', pop: 14038, desc: 'a riverside town south of Worcester', landmark: 'known for Dorothy Pond, the historic Blackstone Canal, and convenient highway access' },
  { name: 'Sutton', pop: 9407, desc: 'a pastoral Worcester County community', landmark: 'celebrated for Purgatory Chasm State Reservation and its scenic rural character' },
  { name: 'Northborough', pop: 15707, desc: 'a family-friendly MetroWest town', landmark: 'offering excellent schools, the Northborough Trails, and easy access to I-290 and Route 20' },
  { name: 'Westborough', pop: 19659, desc: 'a thriving I-495 tech hub', landmark: 'hosting major corporate offices, the Westborough Tennis and Swim Club, and a walkable town center' },
  { name: 'Northbridge', pop: 16800, desc: 'home to the village of Whitinsville', landmark: 'known for the Whitin Machine Works heritage and the Blackstone River Greenway' },
  { name: 'Uxbridge', pop: 14162, desc: 'the gateway to the Blackstone Valley', landmark: 'featuring the Blackstone River and Canal Heritage State Park and scenic West Hill Dam' },
  { name: 'Douglas', pop: 8895, desc: 'a wooded southern Worcester County town', landmark: 'home to Douglas State Forest and Wallum Lake for year-round outdoor recreation' },
  { name: 'Dudley', pop: 12154, desc: 'home to Nichols College', landmark: 'offering a collegiate atmosphere, scenic Pierpont Meadow, and proximity to Webster Lake' },
  { name: 'Charlton', pop: 13735, desc: 'a growing central Massachusetts town', landmark: 'with Buffumville Lake, the Charlton Orchards, and a rural New England atmosphere' },
  { name: 'Brookfield', pop: 3380, desc: 'a pastoral Quaboag Valley town', landmark: 'featuring Lake Quacumquasit, historic Brookfield Common, and the Quaboag River' },
  { name: 'Warren', pop: 5135, desc: 'a small Quaboag Valley community', landmark: 'with Quaboag River frontage, historic Warren Center, and an affordable cost of living' },
  { name: 'Palmer', pop: 12448, desc: 'the Town of Seven Railroads', landmark: 'at the crossroads of the Mass Pike and Route 32 with a rich railroad heritage' },
  { name: 'Ludlow', pop: 21399, desc: 'a close-knit community near Springfield', landmark: 'known for its strong Portuguese-American community, Ludlow Fish, and Westover Golf Course' },
  { name: 'Agawam', pop: 29062, desc: 'home to Six Flags New England', landmark: 'where New England\'s largest amusement park draws millions alongside a thriving residential community' },
  { name: 'West Springfield', pop: 28948, desc: 'the home of The Big E', landmark: 'hosting the Eastern States Exposition, New England\'s largest fair, each September' },
  { name: 'Easthampton', pop: 16185, desc: 'a creative arts community in the Pioneer Valley', landmark: 'with a vibrant mill-district gallery scene, Nonotuck Park, and the Manhan Rail Trail' },
  { name: 'Northampton', pop: 28726, desc: 'a progressive cultural hub', landmark: 'home to Smith College, a legendary live-music scene, and one of the best downtowns in New England' },
  { name: 'Amherst', pop: 39263, desc: 'a renowned college town', landmark: 'home to UMass Amherst, Amherst College, Hampshire College, and the Emily Dickinson Museum' },
  { name: 'Belchertown', pop: 15084, desc: 'a scenic Pioneer Valley town', landmark: 'featuring Quabbin Reservoir, New England\'s largest body of inland water, and pastoral hillside views' },
  { name: 'Ware', pop: 10016, desc: 'a Quabbin region community', landmark: 'with the Ware River, Grenville Park, and access to Quabbin Reservoir\'s eastern shore' },
  { name: 'Gardner', pop: 20605, desc: 'the Chair City', landmark: 'famous for the world\'s largest chair and a long furniture-manufacturing heritage along Route 2' },
  { name: 'Winchendon', pop: 10900, desc: 'Toy Town', landmark: 'named for its historic toy-manufacturing industry and nestled near the New Hampshire border' },
  { name: 'Templeton', pop: 8136, desc: 'a quiet north-central Massachusetts town', landmark: 'offering Otter River State Forest, Baldwinville\'s scenic charm, and a strong community identity' },
  { name: 'Athol', pop: 11887, desc: 'a gateway to the Quabbin wilderness', landmark: 'home to the Millers River and surrounded by some of the most unspoiled landscape in the state' },
  { name: 'Orange', pop: 7839, desc: 'a North Quabbin community', landmark: 'featuring Tully Lake, the Orange Innovation Center, and a tight-knit small-town downtown' },
  { name: 'Clinton', pop: 14000, desc: 'a historic mill town near Wachusett Reservoir', landmark: 'with a beautifully restored downtown, the Museum of Russian Icons, and reservoir-side trails' },
  { name: 'Lancaster', pop: 8483, desc: 'a pastoral town with rich colonial history', landmark: 'featuring the Mary Rowlandson homestead site, stunning farmland views, and Atlantic Union College' },
  { name: 'Sterling', pop: 8156, desc: 'a scenic hilltop community', landmark: 'offering Wachusett Mountain vistas, Davis Farmland, and an agricultural New England lifestyle' },
  { name: 'Berlin', pop: 3229, desc: 'a small, rural Worcester County gem', landmark: 'home to the Berlin Orchards and quintessential New England country roads' },
  { name: 'Bolton', pop: 5665, desc: 'a semi-rural Nashoba Valley town', landmark: 'known for Bolton Orchards, Schartner Farm, and scenic views of Mount Wachusett' },
  { name: 'Hudson', pop: 20296, desc: 'a walkable MetroWest community', landmark: 'with a revitalized downtown, Assabet River Rail Trail, and a growing restaurant scene' },
  { name: 'Stow', pop: 7207, desc: 'a scenic Assabet Valley town', landmark: 'featuring Stow Acres Country Club, apple orchards, and the Assabet River National Wildlife Refuge' },
  { name: 'Maynard', pop: 10746, desc: 'a creative small town with big ideas', landmark: 'where the former Digital Equipment Corporation campus is now a vibrant mixed-use innovation hub' },
  { name: 'Acton', pop: 24021, desc: 'a top-ranked suburban community', landmark: 'prized for award-winning schools, the Bruce Freeman Rail Trail, and a strong community spirit' },
  { name: 'Concord', pop: 19317, desc: 'the birthplace of American independence', landmark: 'home to the Old North Bridge, Walden Pond, and an unmatched literary heritage' },
  { name: 'Lexington', pop: 34454, desc: 'where the shot heard round the world was fired', landmark: 'with Battle Green, Minuteman National Historical Park, and some of the top schools in the state' },
  { name: 'Arlington', pop: 46204, desc: 'a vibrant inner suburb of Boston', landmark: 'featuring the Minuteman Bikeway, Capitol Theatre, and a walkable, diverse commercial district' },
  { name: 'Medfield', pop: 12841, desc: 'a charming Norfolk County town', landmark: 'known for the Rocky Woods Reservation, Medfield State Hospital grounds, and excellent schools' },
  { name: 'Franklin', pop: 33799, desc: 'the first town in America to have a public library', landmark: 'offering the Franklin Cultural District, DelCarte Conservation Area, and top-rated schools' },
  { name: 'Bellingham', pop: 17179, desc: 'a growing community on the Rhode Island border', landmark: 'with convenient access to I-495, a vibrant town common, and expanding commercial development' },
  { name: 'Blackstone', pop: 9636, desc: 'a Blackstone Valley heritage town', landmark: 'where the Blackstone River and Canal towpath offer miles of scenic walking and cycling' },
  { name: 'Hopkinton', pop: 18758, desc: 'the starting line of the Boston Marathon', landmark: 'where the world\'s oldest annual marathon begins each April on the town common' },
  { name: 'Ashland', pop: 17824, desc: 'a MetroWest community with small-town charm', landmark: 'featuring Ashland State Park, the MBTA commuter rail, and a renovated downtown district' },
  { name: 'Holliston', pop: 14953, desc: 'a picturesque MetroWest town', landmark: 'with the Upper Charles Rail Trail, Lake Winthrop, and a quintessential New England town center' },
  { name: 'Upton', pop: 8044, desc: 'a rural gem in the Blackstone Valley', landmark: 'home to Upton State Forest and Heritage Park with miles of mountain-biking and hiking trails' },
  { name: 'Mendon', pop: 6379, desc: 'a pastoral southern Worcester County town', landmark: 'featuring the Southwick\'s Zoo, one of the largest zoos in New England, and scenic farmland' },
  { name: 'Hopedale', pop: 5911, desc: 'a unique planned-community town', landmark: 'founded as a Utopian community, now known for the Draper Corporation heritage and Hopedale Pond' },
  { name: 'Whitinsville', pop: 7000, desc: 'a historic Northbridge village', landmark: 'centered around the Whitin Machine Works legacy and the Blackstone River bikeway' },
  { name: 'Chelmsford', pop: 35939, desc: 'a Merrimack Valley suburb', landmark: 'with Heart Pond, Chelmsford Center for the Arts, and strong schools along the Route 3 corridor' },
  { name: 'Billerica', pop: 43952, desc: 'a growing Middlesex County community', landmark: 'offering Nuttings Lake, the Middlesex Canal Museum, and a mix of suburban living and tech industry' },
  { name: 'Dracut', pop: 31863, desc: 'a Merrimack Valley residential town', landmark: 'with scenic Long Pond, the Dracut State Forest, and convenient access to Lowell and I-93' },
  { name: 'Southborough', pop: '10,200', desc: 'A charming suburban town in MetroWest', landmark: 'St. Mark\'s School and the Sudbury Reservoir' },
  { name: 'Andover', pop: '36,500', desc: 'An affluent Merrimack Valley town', landmark: 'Phillips Academy and the Addison Gallery' },
  { name: 'Boylston', pop: '4,700', desc: 'A small rural town in Central MA', landmark: 'Tower Hill Botanic Garden' },
  { name: 'Brookline', pop: '63,000', desc: 'An affluent town bordering Boston', landmark: 'Coolidge Corner and the JFK National Historic Site' },
  { name: 'Chelmsford', pop: '35,000', desc: 'A suburban town in the Merrimack Valley', landmark: 'Chelmsford Center and the historic town common' },
  { name: 'Dartmouth', pop: '34,000', desc: 'A South Coast community near New Bedford', landmark: 'Padanaram Village and Lloyd Center' },
  { name: 'Dracut', pop: '32,000', desc: 'A growing Merrimack Valley community', landmark: 'Dracut State Forest and local farms' },
  { name: 'Easton', pop: '25,000', desc: 'A historic town south of Boston', landmark: 'Stonehill College and Ames Shovel Works' },
  { name: 'Greenfield', pop: '17,500', desc: 'The county seat of Franklin County', landmark: 'Historic downtown and the Poet\'s Seat Tower' },
  { name: 'Medway', pop: '13,500', desc: 'A suburban town in Norfolk County', landmark: 'Choate Park and the Charles River' },
  { name: 'Plymouth', pop: '61,000', desc: 'America\'s Hometown on the South Shore', landmark: 'Plymouth Rock and the Mayflower II' },
  { name: 'Princeton', pop: '3,500', desc: 'A scenic hilltop town in Central MA', landmark: 'Wachusett Mountain and Redemption Rock' },
  { name: 'Randolph', pop: '34,000', desc: 'A diverse town south of Boston', landmark: 'Stetson Hall and local cultural centers' },
  { name: 'South Hadley', pop: '18,000', desc: 'A college town in the Pioneer Valley', landmark: 'Mount Holyoke College and Skinner State Park' },
  { name: 'Stoughton', pop: '29,000', desc: 'A suburban town south of Boston', landmark: 'Stoughton Town Common and historic mills' },
  { name: 'Tewksbury', pop: '31,000', desc: 'A Merrimack Valley community', landmark: 'Tewksbury State Hospital grounds and local parks' },
  { name: 'Wareham', pop: '22,000', desc: 'The gateway to Cape Cod', landmark: 'Onset Beach and the Wareham Gatemen' },
  { name: 'West Boylston', pop: '8,000', desc: 'A scenic town near Worcester', landmark: 'Wachusett Reservoir and the Old Stone Church' },
  { name: 'Westminster', pop: '8,000', desc: 'A rural town in North Central MA', landmark: 'Wachusett Mountain views and Crocker Pond' },

  // ─── ADDITIONAL MASSACHUSETTS TOWNS ─────────────────────────────────────────
  { name: 'Abington', pop: 16378, desc: 'a friendly South Shore community', landmark: 'Island Grove Park and the historic Abington town center' },
  { name: 'Adams', pop: 8166, desc: 'a Berkshire County mill town', landmark: 'the gateway to Mount Greylock, the highest peak in Massachusetts' },
  { name: 'Amesbury', pop: 17474, desc: 'a scenic Merrimack Valley town', landmark: 'the Amesbury Carriagetown Marketplace and the Powow River' },
  { name: 'Ashburnham', pop: 6348, desc: 'a quiet north-central Massachusetts town', landmark: 'Ashburnham State Forest and Mount Watatic trails' },
  { name: 'Ashby', pop: 3222, desc: 'a rural hilltop community near Fitchburg', landmark: 'Ashby town common and scenic Willard Brook State Forest' },
  { name: 'Avon', pop: 4660, desc: 'a compact Norfolk County town', landmark: 'D.W. Field Park and convenient access to Route 24' },
  { name: 'Ayer', pop: 8707, desc: 'a historic military-connected town', landmark: 'Fort Devens and the Nashua River Rail Trail' },
  { name: 'Barre', pop: 5596, desc: 'a rural Worcester County town', landmark: 'Barre Falls Dam and scenic farmland in the Quabbin region' },
  { name: 'Bedford', pop: 14383, desc: 'a historic Minuteman community', landmark: 'Hanscom Air Force Base and the Minuteman Bikeway terminus' },
  { name: 'Belmont', pop: 26330, desc: 'a prestigious suburb west of Boston', landmark: 'the Belmont Hill and excellent public schools' },
  { name: 'Berkley', pop: 6874, desc: 'a rural town in Bristol County', landmark: 'Dighton Rock State Park and the Taunton River' },
  { name: 'Bernardston', pop: 2072, desc: 'a small Franklin County town', landmark: 'scenic views of the Connecticut River Valley and Fall River' },
  { name: 'Blandford', pop: 1233, desc: 'a hilltop Berkshire community', landmark: 'Blandford State Forest and the historic Blandford Fair' },
  { name: 'Boxborough', pop: 6082, desc: 'a small town along I-495', landmark: 'Blanchard Memorial School and the Boxborough Conservation Trust lands' },
  { name: 'Boxford', pop: 8588, desc: 'a rural North Shore community', landmark: 'Boxford State Forest and scenic horse country' },
  { name: 'Bridgewater', pop: 28486, desc: 'a college town south of Boston', landmark: 'Bridgewater State University and the Town River' },
  { name: 'Brimfield', pop: 3792, desc: 'a town famous for its antiques market', landmark: 'the Brimfield Antique Flea Markets, the largest outdoor antique show in the US' },
  { name: 'Canton', pop: 24370, desc: 'a thriving Norfolk County suburb', landmark: 'the Blue Hills Reservation and Canton Junction commuter rail station' },
  { name: 'Carver', pop: 11830, desc: 'the cranberry capital of Massachusetts', landmark: 'Edaville Family Theme Park and vast cranberry bogs' },
  { name: 'Chatham', pop: 6133, desc: 'a charming Cape Cod seaside town', landmark: 'Chatham Lighthouse and the Chatham Fish Pier' },
  { name: 'Cheshire', pop: 3165, desc: 'a small Berkshire County town', landmark: 'Cheshire Reservoir and the Ashuwillticook Rail Trail' },
  { name: 'Chester', pop: 1410, desc: 'a scenic Hilltowns community', landmark: 'Chester Railway Station and the Westfield River Gorge' },
  { name: 'Cohasset', pop: 8413, desc: 'a picturesque South Shore coastal town', landmark: 'Cohasset Harbor and the historic Minot Ledge Lighthouse views' },
  { name: 'Colrain', pop: 1671, desc: 'a rural Franklin County town', landmark: 'scenic covered bridges and the North River valley' },
  { name: 'Conway', pop: 1897, desc: 'a pastoral Pioneer Valley town', landmark: 'Conway covered bridge and the South River valley' },
  { name: 'Dalton', pop: 6417, desc: 'a Berkshire County papermaking town', landmark: 'Crane & Co. paper mill, producer of US currency paper' },
  { name: 'Danvers', pop: 28054, desc: 'a North Shore community with colonial roots', landmark: 'the Rebecca Nurse Homestead and the Liberty Tree Mall area' },
  { name: 'Dedham', pop: 25544, desc: 'the county seat of Norfolk County', landmark: 'Legacy Place shopping center and historic Dedham Square' },
  { name: 'Deerfield', pop: 5090, desc: 'a town rich in colonial history', landmark: 'Historic Deerfield museum village and the Yankee Candle flagship' },
  { name: 'Dennis', pop: 13866, desc: 'a scenic mid-Cape Cod town', landmark: 'Cape Playhouse, America\'s oldest professional summer theater' },
  { name: 'Dighton', pop: 8024, desc: 'a quiet Bristol County town', landmark: 'Dighton Rock and the Taunton River waterfront' },
  { name: 'Dover', pop: 6215, desc: 'one of the wealthiest towns in Massachusetts', landmark: 'Noanet Woodlands and scenic rural estates' },
  { name: 'Dunstable', pop: 3464, desc: 'a rural Middlesex County town', landmark: 'Tyngsborough-Dunstable State Forest and pastoral landscapes' },
  { name: 'Duxbury', pop: 16090, desc: 'a historic South Shore coastal town', landmark: 'Duxbury Beach and the Myles Standish Monument' },
  { name: 'East Bridgewater', pop: 14554, desc: 'a growing Plymouth County community', landmark: 'Satucket River and the East Bridgewater town common' },
  { name: 'East Longmeadow', pop: 16383, desc: 'a suburban community near Springfield', landmark: 'Heritage Park and the East Longmeadow town common' },
  { name: 'Edgartown', pop: 5245, desc: 'a historic Martha\'s Vineyard town', landmark: 'Edgartown Lighthouse and the whaling captain houses' },
  { name: 'Erving', pop: 1830, desc: 'a small Franklin County community', landmark: 'Erving State Forest and scenic Millers River views' },
  { name: 'Essex', pop: 3802, desc: 'a North Shore maritime town', landmark: 'the Essex Shipbuilding Museum and famous fried clam restaurants' },
  { name: 'Fairhaven', pop: 16078, desc: 'a coastal community near New Bedford', landmark: 'Fort Phoenix State Reservation and the Fairhaven Town Hall' },
  { name: 'Falmouth', pop: 32660, desc: 'a vibrant Cape Cod town', landmark: 'Woods Hole Oceanographic Institution and the Shining Sea Bikeway' },
  { name: 'Foxborough', pop: 19284, desc: 'home to Gillette Stadium', landmark: 'the New England Patriots and Revolution home field and Patriot Place' },
  { name: 'Georgetown', pop: 8734, desc: 'a rural North Shore community', landmark: 'Georgetown-Rowley State Forest and scenic farmland' },
  { name: 'Gill', pop: 1471, desc: 'a small Connecticut River town', landmark: 'the French King Bridge and Barton Cove on the Connecticut River' },
  { name: 'Gloucester', pop: 30273, desc: 'America\'s oldest seaport', landmark: 'the Gloucester Fisherman\'s Memorial and Rocky Neck Art Colony' },
  { name: 'Granby', pop: 6456, desc: 'a Pioneer Valley agricultural town', landmark: 'the Dinosaur Footprints Reservation and tobacco farmland' },
  { name: 'Great Barrington', pop: 6873, desc: 'a vibrant southern Berkshires town', landmark: 'a thriving downtown arts scene and the Mahaiwe Performing Arts Center' },
  { name: 'Groton', pop: 11547, desc: 'a historic Nashoba Valley town', landmark: 'Groton School and the Nashua River' },
  { name: 'Groveland', pop: 6861, desc: 'a Merrimack Valley community', landmark: 'the Merrimack River waterfront and Johnson\'s Pond' },
  { name: 'Hadley', pop: 5348, desc: 'a Pioneer Valley farming community', landmark: 'rich agricultural heritage and the Hadley Farm Museum' },
  { name: 'Halifax', pop: 8048, desc: 'a Plymouth County residential town', landmark: 'Monponsett Pond and a quiet small-town atmosphere' },
  { name: 'Hamilton', pop: 7764, desc: 'a scenic North Shore equestrian community', landmark: 'the Myopia Hunt Club and scenic Bradley Palmer State Park' },
  { name: 'Hampden', pop: 5252, desc: 'a residential community near Springfield', landmark: 'Laughing Brook Wildlife Sanctuary and scenic hilltop views' },
  { name: 'Hanover', pop: 14852, desc: 'a South Shore suburban community', landmark: 'Hanover Mall and the scenic North River' },
  { name: 'Hanson', pop: 11055, desc: 'a Plymouth County residential town', landmark: 'Maquan Pond and Hanson Town Forest trails' },
  { name: 'Hardwick', pop: 3021, desc: 'a rural Quabbin region town', landmark: 'Hardwick Vineyard and Winery and the Ware River valley' },
  { name: 'Harvard', pop: 6520, desc: 'a scenic pastoral community', landmark: 'Fruitlands Museum and the historic Shaker Village site' },
  { name: 'Harwich', pop: 12382, desc: 'a Cape Cod town with harbor charm', landmark: 'Harwich Port and the Cape Cod Baseball League Mariners' },
  { name: 'Hatfield', pop: 3329, desc: 'a Pioneer Valley farming town', landmark: 'scenic Connecticut River farmland and historic Hatfield center' },
  { name: 'Hingham', pop: 24803, desc: 'a historic South Shore town', landmark: 'the Old Ship Church, the oldest wooden church in continuous use in America' },
  { name: 'Hinsdale', pop: 1873, desc: 'a small Berkshire County town', landmark: 'Plunkett Reservoir and scenic Berkshire hilltop views' },
  { name: 'Holbrook', pop: 11458, desc: 'a compact Norfolk County community', landmark: 'Mary Wales Park and convenient commuter rail access' },
  { name: 'Holland', pop: 2500, desc: 'a rural Hampden County community', landmark: 'Hamilton Reservoir and scenic woodlands near the Connecticut border' },
  { name: 'Hubbardston', pop: 4813, desc: 'a rural north-central Massachusetts town', landmark: 'Hubbardston State Forest and scenic Burnshirt River valley' },
  { name: 'Hull', pop: 10293, desc: 'a peninsular coastal community south of Boston', landmark: 'Nantasket Beach and Paragon Carousel' },
  { name: 'Ipswich', pop: 14050, desc: 'a historic North Shore town', landmark: 'Crane Beach, one of the most beautiful beaches in New England' },
  { name: 'Kingston', pop: 14273, desc: 'a South Shore town near Plymouth', landmark: 'Jones River and the Silver Lake waterfront' },
  { name: 'Lakeville', pop: 11758, desc: 'a growing Plymouth County town', landmark: 'Assawompset Pond and scenic cranberry bogs' },
  { name: 'Lee', pop: 5788, desc: 'a Berkshire County gateway town', landmark: 'the gateway to the Mass Pike Berkshires corridor and October Mountain State Forest' },
  { name: 'Lenox', pop: 5025, desc: 'a cultural jewel of the Berkshires', landmark: 'Tanglewood, the summer home of the Boston Symphony Orchestra' },
  { name: 'Leverett', pop: 1866, desc: 'a small hilltowns community', landmark: 'scenic rural landscapes and the Leverett Peace Pagoda' },
  { name: 'Longmeadow', pop: 15865, desc: 'an affluent Springfield suburb', landmark: 'Longmeadow Country Club and the historic Longmeadow Green' },
  { name: 'Lunenburg', pop: 11663, desc: 'a north-central Massachusetts community', landmark: 'Whalom Park and scenic Lake Whalom' },
  { name: 'Lynnfield', pop: 13335, desc: 'a North Shore residential town', landmark: 'MarketStreet Lynnfield shopping center and Pillings Pond' },
  { name: 'Manchester-by-the-Sea', pop: 5630, desc: 'a picturesque North Shore coastal town', landmark: 'Singing Beach and scenic Manchester Harbor' },
  { name: 'Mansfield', pop: 24152, desc: 'a growing southeastern Massachusetts town', landmark: 'the Xfinity Center outdoor amphitheater and MBTA commuter rail access' },
  { name: 'Marblehead', pop: 20457, desc: 'the birthplace of the American Navy', landmark: 'Marblehead Harbor and historic Old Town district' },
  { name: 'Marion', pop: 5232, desc: 'a Buzzards Bay coastal community', landmark: 'Tabor Academy and the scenic Sippican Harbor' },
  { name: 'Marshfield', pop: 26279, desc: 'a South Shore seaside community', landmark: 'the Daniel Webster Estate and scenic Brant Rock beaches' },
  { name: 'Mashpee', pop: 14663, desc: 'a Cape Cod community with Wampanoag heritage', landmark: 'Mashpee Commons and the Mashpee Wampanoag Tribal lands' },
  { name: 'Mattapoisett', pop: 6360, desc: 'a Buzzards Bay harbor town', landmark: 'Mattapoisett Town Beach and the historic shipbuilding heritage' },
  { name: 'Middleborough', pop: 25437, desc: 'a large Plymouth County town', landmark: 'the Soule Homestead and cranberry harvesting heritage' },
  { name: 'Middleton', pop: 9861, desc: 'a North Shore residential community', landmark: 'Middleton Pond and scenic rural landscapes' },
  { name: 'Millville', pop: 3260, desc: 'one of the smallest towns in Massachusetts', landmark: 'the Blackstone River and a tight-knit village atmosphere' },
  { name: 'Milton', pop: 28600, desc: 'a prestigious suburb south of Boston', landmark: 'the Blue Hills Reservation and the Great Blue Hill summit' },
  { name: 'Monson', pop: 8820, desc: 'a Hampden County community', landmark: 'Monson Academy heritage and the Chicopee Brook valley' },
  { name: 'Montague', pop: 8291, desc: 'a Franklin County town with five villages', landmark: 'the Great Falls Discovery Center and Turners Falls arts district' },
  { name: 'Nahant', pop: 3512, desc: 'a small peninsular town on the North Shore', landmark: 'Nahant Beach Reservation and panoramic ocean views' },
  { name: 'Nantucket', pop: 14255, desc: 'a historic island community', landmark: 'cobblestoned Main Street and the Whaling Museum' },
  { name: 'Needham', pop: 31388, desc: 'an affluent suburb west of Boston', landmark: 'the Needham Town Forest and top-ranked public schools' },
  { name: 'Norfolk', pop: 12050, desc: 'a scenic Norfolk County community', landmark: 'Stony Brook Wildlife Sanctuary and King Philip Regional area' },
  { name: 'North Adams', pop: 12961, desc: 'a northern Berkshire County city', landmark: 'MASS MoCA, the largest contemporary art museum in the US' },
  { name: 'North Andover', pop: 31187, desc: 'an affluent Merrimack Valley community', landmark: 'Merrimack College and the Stevens Estate at Osgood Hill' },
  { name: 'North Attleborough', pop: 29997, desc: 'a growing southeastern Massachusetts town', landmark: 'the Emerald Square Mall area and World War I Memorial Park' },
  { name: 'North Brookfield', pop: 4831, desc: 'a small central Massachusetts community', landmark: 'historic town common and scenic Quaboag Valley surroundings' },
  { name: 'North Reading', pop: 15870, desc: 'a Middlesex County suburban town', landmark: 'Ipswich River Park and scenic Martin\'s Pond' },
  { name: 'Norton', pop: 19808, desc: 'home to Wheaton College', landmark: 'Wheaton College campus and the Norton Reservoir' },
  { name: 'Norwell', pop: 11607, desc: 'a scenic South Shore community', landmark: 'the historic Norwell Village and Jacobs Pond' },
  { name: 'Norwood', pop: 30025, desc: 'a thriving Norfolk County town', landmark: 'Norwood Memorial Airport and a vibrant downtown commercial district' },
  { name: 'Oak Bluffs', pop: 5262, desc: 'a colorful Martha\'s Vineyard town', landmark: 'the iconic gingerbread cottages and Flying Horses Carousel' },
  { name: 'Orleans', pop: 5829, desc: 'a Lower Cape Cod town', landmark: 'Nauset Beach and the Cape Cod National Seashore access' },
  { name: 'Pelham', pop: 1296, desc: 'a small hilltowns community east of Amherst', landmark: 'scenic Pelham Hills and the Quabbin Reservoir watershed' },
  { name: 'Pembroke', pop: 18427, desc: 'a South Shore residential community', landmark: 'Pembroke Ponds and scenic North River frontage' },
  { name: 'Pepperell', pop: 12420, desc: 'a Nashoba Valley community near NH border', landmark: 'the Nashua River and scenic covered bridge' },
  { name: 'Plainville', pop: 9343, desc: 'a small Norfolk County town', landmark: 'Plainridge Park Casino and convenient I-495 access' },
  { name: 'Provincetown', pop: 2942, desc: 'a vibrant Cape tip arts community', landmark: 'the Pilgrim Monument and a thriving arts and cultural scene' },
  { name: 'Raynham', pop: 14921, desc: 'a growing Bristol County community', landmark: 'Raynham Park area and convenient Route 138 corridor' },
  { name: 'Reading', pop: 25500, desc: 'a Middlesex County suburban community', landmark: 'the Reading Town Forest and the historic downtown' },
  { name: 'Rehoboth', pop: 12595, desc: 'a rural Bristol County town', landmark: 'scenic farmland, horse country, and the Palmer River' },
  { name: 'Rockland', pop: 18006, desc: 'a South Shore community', landmark: 'Union Street commercial district and the historic Rockland town center' },
  { name: 'Rockport', pop: 7441, desc: 'a scenic Cape Ann coastal town', landmark: 'Bearskin Neck, Motif No. 1, and the Rockport Art Association' },
  { name: 'Rowley', pop: 6353, desc: 'a North Shore marshland community', landmark: 'the Great Marsh and scenic Plum Island views' },
  { name: 'Royalston', pop: 1328, desc: 'a remote north-central Massachusetts town', landmark: 'Royalston Falls and Tully River valley wilderness' },
  { name: 'Russell', pop: 1799, desc: 'a small Hampden County town', landmark: 'the Westfield River Gorge and scenic hilltowns terrain' },
  { name: 'Sandwich', pop: 20495, desc: 'the oldest town on Cape Cod', landmark: 'the Sandwich Glass Museum and Heritage Museums & Gardens' },
  { name: 'Saugus', pop: 28326, desc: 'a community north of Boston', landmark: 'Saugus Iron Works National Historic Site and Route 1 dining' },
  { name: 'Scituate', pop: 19276, desc: 'a scenic South Shore coastal town', landmark: 'Scituate Lighthouse and the beautiful harbor village' },
  { name: 'Seekonk', pop: 16235, desc: 'a Bristol County community on the RI border', landmark: 'Seekonk Speedway and convenient Route 6 corridor shopping' },
  { name: 'Sharon', pop: 18613, desc: 'a Norfolk County residential town', landmark: 'Moose Hill Wildlife Sanctuary and scenic Sharon Heights' },
  { name: 'Sheffield', pop: 3164, desc: 'a southern Berkshire County town', landmark: 'Bartholomew\'s Cobble and scenic Housatonic River valley' },
  { name: 'Shelburne', pop: 1799, desc: 'a Franklin County hilltowns community', landmark: 'Shelburne Falls Bridge of Flowers and glacial potholes' },
  { name: 'Sherborn', pop: 4413, desc: 'a rural MetroWest community', landmark: 'scenic horse farms and the Rocky Narrows Reservation' },
  { name: 'Shirley', pop: 7620, desc: 'a small north-central Massachusetts town', landmark: 'Shirley Meeting House and Squannacook River trails' },
  { name: 'Somerset', pop: 18135, desc: 'a Bristol County waterfront community', landmark: 'the Brayton Point waterfront and Taunton River views' },
  { name: 'Southampton', pop: 6174, desc: 'a Pioneer Valley residential community', landmark: 'scenic hilltop views and Manhan Meadows' },
  { name: 'Southwick', pop: 10009, desc: 'a Hampden County agricultural community', landmark: 'Congamond Lakes and scenic tobacco farmland' },
  { name: 'Stockbridge', pop: 1791, desc: 'a quintessential New England village', landmark: 'the Norman Rockwell Museum and Berkshire cultural scene' },
  { name: 'Stoneham', pop: 23230, desc: 'a Middlesex County community north of Boston', landmark: 'Spot Pond and scenic Stone Zoo area' },
  { name: 'Sudbury', pop: 19655, desc: 'a historic MetroWest community', landmark: 'the Wayside Inn, America\'s oldest operating inn' },
  { name: 'Sunderland', pop: 3684, desc: 'a Pioneer Valley town along the Connecticut River', landmark: 'Mount Sugarloaf State Reservation and scenic river views' },
  { name: 'Swampscott', pop: 15298, desc: 'a North Shore coastal community', landmark: 'scenic oceanfront Fisherman\'s Beach and King\'s Beach' },
  { name: 'Swansea', pop: 16800, desc: 'a Bristol County town near Fall River', landmark: 'scenic waterfront along Mount Hope Bay and Cole\'s River' },
  { name: 'Tisbury', pop: 4845, desc: 'a Martha\'s Vineyard harbor town', landmark: 'Vineyard Haven Harbor and the Martha\'s Vineyard ferry terminal' },
  { name: 'Townsend', pop: 9757, desc: 'a north-central Massachusetts community', landmark: 'Townsend State Forest and the Squannacook River' },
  { name: 'Truro', pop: 2164, desc: 'an outer Cape Cod community', landmark: 'Highland Light and the Cape Cod National Seashore' },
  { name: 'Tyngsborough', pop: 12898, desc: 'a Merrimack Valley community on the NH border', landmark: 'the Merrimack River and scenic Tyngsborough Bridge' },
  { name: 'Wakefield', pop: 27045, desc: 'a Middlesex County lakeside community', landmark: 'Lake Quannapowitt and a vibrant downtown district' },
  { name: 'Wales', pop: 1875, desc: 'a rural Hampden County community', landmark: 'scenic woodlands along the Quaboag River headwaters' },
  { name: 'Walpole', pop: 25017, desc: 'a Norfolk County suburban community', landmark: 'Francis William Bird Park and the Walpole town common' },
  { name: 'Watertown', pop: 35939, desc: 'a vibrant inner suburb west of Boston', landmark: 'Arsenal Yards mixed-use development and the Charles River paths' },
  { name: 'Wayland', pop: 13842, desc: 'a scenic MetroWest residential town', landmark: 'Great Meadows National Wildlife Refuge and scenic Sudbury River' },
  { name: 'Wellesley', pop: 29673, desc: 'an affluent suburb west of Boston', landmark: 'Wellesley College and a thriving Wellesley Square shopping district' },
  { name: 'Wellfleet', pop: 2731, desc: 'an outer Cape Cod community', landmark: 'Wellfleet Harbor and world-famous Wellfleet oysters' },
  { name: 'Wenham', pop: 5168, desc: 'a scenic North Shore community', landmark: 'Gordon College and scenic Wenham Lake' },
  { name: 'West Bridgewater', pop: 7380, desc: 'a Plymouth County residential community', landmark: 'the Town River and scenic West Bridgewater commons' },
  { name: 'West Brookfield', pop: 3753, desc: 'a Quaboag Valley community', landmark: 'historic West Brookfield Common and scenic Wickaboag Pond' },
  { name: 'West Newbury', pop: 4720, desc: 'a rural Merrimack Valley town', landmark: 'scenic horse farms and the Merrimack River waterfront' },
  { name: 'West Stockbridge', pop: 1186, desc: 'a quaint Berkshire County village', landmark: 'a charming downtown arts village and Williams River' },
  { name: 'Westford', pop: 25010, desc: 'a growing Middlesex County suburb', landmark: 'Nashoba Valley Ski Area and the Westford town common' },
  { name: 'Weston', pop: 12135, desc: 'one of the wealthiest suburbs in Massachusetts', landmark: 'scenic conservation lands and the Case Estates' },
  { name: 'Westport', pop: 16120, desc: 'a South Coast agricultural and coastal town', landmark: 'Horseneck Beach State Reservation and scenic farmland' },
  { name: 'Westwood', pop: 16215, desc: 'a Norfolk County residential community', landmark: 'Hale Reservation and Buckmaster Pond' },
  { name: 'Whately', pop: 1558, desc: 'a small Pioneer Valley farming town', landmark: 'scenic tobacco and asparagus farmland along the Connecticut River' },
  { name: 'Whitman', pop: 15331, desc: 'a Plymouth County community', landmark: 'the historic town center and scenic parks' },
  { name: 'Wilbraham', pop: 14868, desc: 'a residential community east of Springfield', landmark: 'Minnechaug Mountain and the Wilbraham-Monson Academy' },
  { name: 'Williamsburg', pop: 2434, desc: 'a Hampshire County hilltowns community', landmark: 'the Williamsburg General Store and scenic Mill River valley' },
  { name: 'Williamstown', pop: 7513, desc: 'a Berkshire County college town', landmark: 'Williams College, the Clark Art Institute, and the Williamstown Theatre Festival' },
  { name: 'Wilmington', pop: 23390, desc: 'a Middlesex County suburban community', landmark: 'Silver Lake and convenient I-93 access' },
  { name: 'Winthrop', pop: 18544, desc: 'a coastal community adjacent to Boston', landmark: 'scenic Winthrop Beach and views of Boston Harbor' },
  { name: 'Wrentham', pop: 12462, desc: 'a Norfolk County community', landmark: 'Wrentham Village Premium Outlets and scenic Lake Pearl' },
  { name: 'Yarmouth', pop: 23745, desc: 'a mid-Cape Cod community', landmark: 'Bass Hole Boardwalk and scenic Gray\'s Beach' },

  // ─── CONNECTICUT ────────────────────────────────────────────────────────────
  { name: 'Hartford', state: 'CT', pop: 121054, desc: 'the capital of Connecticut', landmark: 'the Wadsworth Atheneum, America\'s oldest public art museum, and the Mark Twain House' },
  { name: 'New Haven', state: 'CT', pop: 134023, desc: 'a world-renowned university city', landmark: 'Yale University and the famous New Haven pizza scene' },
  { name: 'Bridgeport', state: 'CT', pop: 148529, desc: 'Connecticut\'s most populous city', landmark: 'the Barnum Museum and a revitalizing waterfront district' },
  { name: 'Stamford', state: 'CT', pop: 135470, desc: 'a thriving corporate hub in southwestern Connecticut', landmark: 'major Fortune 500 headquarters and a bustling downtown' },
  { name: 'Waterbury', state: 'CT', pop: 114403, desc: 'the Brass City', landmark: 'the Palace Theater and rich manufacturing heritage' },
  { name: 'Norwalk', state: 'CT', pop: 91184, desc: 'a vibrant coastal city in Fairfield County', landmark: 'the Maritime Aquarium and historic SoNo district' },
  { name: 'Danbury', state: 'CT', pop: 86518, desc: 'the Hat City of Connecticut', landmark: 'the Danbury Railway Museum and Tarrywile Park' },
  { name: 'New Britain', state: 'CT', pop: 74135, desc: 'the Hardware City', landmark: 'the New Britain Museum of American Art and a strong Polish-American community' },
  { name: 'Bristol', state: 'CT', pop: 60833, desc: 'the home of ESPN', landmark: 'Lake Compounce, America\'s oldest amusement park, and the ESPN campus' },
  { name: 'Meriden', state: 'CT', pop: 60850, desc: 'the Silver City of Connecticut', landmark: 'Hubbard Park and scenic Castle Craig tower' },
  { name: 'West Haven', state: 'CT', pop: 55584, desc: 'a coastal New Haven County community', landmark: 'the University of New Haven and Savin Rock' },
  { name: 'Middletown', state: 'CT', pop: 47717, desc: 'a Connecticut River city', landmark: 'Wesleyan University and a vibrant Main Street district' },
  { name: 'Shelton', state: 'CT', pop: 41784, desc: 'a growing Fairfield County city', landmark: 'Indian Well State Park and a strong commercial base' },
  { name: 'Norwich', state: 'CT', pop: 40125, desc: 'the Rose of New England', landmark: 'Mohegan Sun nearby and the historic Norwich Harbor' },
  { name: 'Torrington', state: 'CT', pop: 35515, desc: 'the largest city in Litchfield County', landmark: 'the Warner Theatre and scenic Naugatuck River valley' },
  { name: 'Glastonbury', state: 'CT', pop: 35159, desc: 'an affluent Hartford suburb', landmark: 'scenic farms along the Connecticut River and Glastonbury Center' },
  { name: 'Manchester', state: 'CT', pop: 59713, desc: 'a growing Hartford County community', landmark: 'Wickham Park and the historic Cheney Brothers silk mills' },
  { name: 'Enfield', state: 'CT', pop: 42488, desc: 'a Connecticut town on the Massachusetts border', landmark: 'scenic Connecticut River views and Old Enfield Falls' },
  { name: 'Vernon', state: 'CT', pop: 30490, desc: 'a Tolland County community', landmark: 'scenic Valley Falls Park and a suburban town center' },
  { name: 'Groton', state: 'CT', pop: 38411, desc: 'the submarine capital of the world', landmark: 'the USS Nautilus museum and Naval Submarine Base New London' },
  { name: 'Stratford', state: 'CT', pop: 52355, desc: 'a Housatonic River community', landmark: 'historic Stratford Center and Boothe Memorial Park' },
  { name: 'Hamden', state: 'CT', pop: 61169, desc: 'a New Haven suburb with scenic hills', landmark: 'Sleeping Giant State Park and Quinnipiac University' },
  { name: 'East Hartford', state: 'CT', pop: 51045, desc: 'a Hartford County community', landmark: 'historic Pratt & Whitney facilities and Rentschler Field' },
  { name: 'West Hartford', state: 'CT', pop: 64083, desc: 'one of Connecticut\'s most desirable suburbs', landmark: 'Blue Back Square and a thriving restaurant and shopping scene' },
  { name: 'Newington', state: 'CT', pop: 30536, desc: 'a Hartford County suburban town', landmark: 'the Mill Pond Park area and convenient central location' },
  { name: 'Wethersfield', state: 'CT', pop: 27817, desc: 'one of the oldest towns in Connecticut', landmark: 'historic Old Wethersfield and the Webb-Deane-Stevens Museum' },
  { name: 'Rocky Hill', state: 'CT', pop: 20845, desc: 'a Connecticut River community', landmark: 'Dinosaur State Park and the Rocky Hill-Glastonbury Ferry' },
  { name: 'Cromwell', state: 'CT', pop: 14225, desc: 'a Middlesex County community', landmark: 'the TPC River Highlands golf course, home of the Travelers Championship' },
  { name: 'Southington', state: 'CT', pop: 44286, desc: 'the Apple Valley of Connecticut', landmark: 'scenic apple orchards and Mount Southington Ski Area' },
  { name: 'Wallingford', state: 'CT', pop: 44428, desc: 'a New Haven County community', landmark: 'Choate Rosemary Hall and a vibrant town center' },
  { name: 'North Haven', state: 'CT', pop: 24253, desc: 'a New Haven suburb', landmark: 'scenic Sleeping Giant views and strong retail corridors' },
  { name: 'Branford', state: 'CT', pop: 28273, desc: 'a scenic shoreline community', landmark: 'the Thimble Islands and Branford Town Green' },
  { name: 'Guilford', state: 'CT', pop: 22073, desc: 'a historic shoreline town', landmark: 'the 1639 Henry Whitfield House, the oldest stone building in New England' },
  { name: 'Madison', state: 'CT', pop: 17841, desc: 'a picturesque shoreline community', landmark: 'Hammonasset Beach State Park, Connecticut\'s largest public beach' },
  { name: 'Old Saybrook', state: 'CT', pop: 10273, desc: 'a historic Connecticut River mouth town', landmark: 'Saybrook Point and the Katharine Hepburn Cultural Arts Center' },
  { name: 'East Lyme', state: 'CT', pop: 19164, desc: 'a scenic shoreline community', landmark: 'Rocky Neck State Park and scenic Niantic Bay' },
  { name: 'Waterford', state: 'CT', pop: 19571, desc: 'a New London County coastal community', landmark: 'Harkness Memorial State Park and Eugene O\'Neill Theater Center' },
  { name: 'Windham', state: 'CT', pop: 24400, desc: 'a Windham County community', landmark: 'historic Willimantic thread mills and Eastern Connecticut State University' },
  { name: 'Coventry', state: 'CT', pop: 12435, desc: 'a Tolland County residential town', landmark: 'the Nathan Hale Homestead and scenic Coventry Lake' },
  { name: 'Tolland', state: 'CT', pop: 14563, desc: 'a scenic residential community', landmark: 'the historic Tolland Green and Tolland County Courthouse' },
  { name: 'Ellington', state: 'CT', pop: 16426, desc: 'a growing Tolland County community', landmark: 'scenic farmland and Crystal Lake' },
  { name: 'Somers', state: 'CT', pop: 10525, desc: 'a quiet Connecticut town on the MA border', landmark: 'Soapstone Mountain and scenic Somers Mountain' },
  { name: 'Stafford', state: 'CT', pop: 11680, desc: 'a Tolland County community', landmark: 'Stafford Motor Speedway and Stafford Springs mineral springs heritage' },
  { name: 'Plainfield', state: 'CT', pop: 15521, desc: 'a Windham County community', landmark: 'Plainfield Greyhound Park area and the Quinebaug River' },
  { name: 'Killingly', state: 'CT', pop: 17752, desc: 'a Windham County mill town', landmark: 'historic Danielson downtown and the Quinebaug River valley' },
  { name: 'Putnam', state: 'CT', pop: 9584, desc: 'a northeastern Connecticut community', landmark: 'the Putnam antiques district and revitalized downtown Main Street' },
  { name: 'Thompson', state: 'CT', pop: 9458, desc: 'a northeastern Connecticut border town', landmark: 'Thompson Speedway and scenic Quaddick State Park' },
  { name: 'Woodstock', state: 'CT', pop: 8221, desc: 'a scenic northeastern Connecticut town', landmark: 'Roseland Cottage and beautiful Woodstock Fair' },
  { name: 'Brooklyn', state: 'CT', pop: 8450, desc: 'a Windham County community', landmark: 'historic Brooklyn Fair, one of the oldest in the country' },
  { name: 'Canterbury', state: 'CT', pop: 5200, desc: 'a rural Windham County town', landmark: 'the Prudence Crandall Museum and scenic agricultural landscapes' },
  { name: 'Colchester', state: 'CT', pop: 16068, desc: 'a New London County community', landmark: 'scenic Day Pond State Park and the Airline Trail' },
  { name: 'East Hampton', state: 'CT', pop: 12717, desc: 'a Middlesex County community', landmark: 'scenic Lake Pocotopaug and the Airline State Park Trail' },
  { name: 'Portland', state: 'CT', pop: 9384, desc: 'a Connecticut River community', landmark: 'the historic Portland brownstone quarries and Meshomasic State Forest' },
  { name: 'Durham', state: 'CT', pop: 7388, desc: 'a Middlesex County agricultural community', landmark: 'the Durham Fair, one of the largest agricultural fairs in New England' },
  { name: 'Bethel', state: 'CT', pop: 20358, desc: 'a Fairfield County community', landmark: 'the Bethel Cinema and a charming downtown district' },
  { name: 'New Fairfield', state: 'CT', pop: 13753, desc: 'a scenic Fairfield County lake town', landmark: 'scenic Candlewood Lake, the largest lake in Connecticut' },
  { name: 'New Milford', state: 'CT', pop: 28115, desc: 'the largest town in Connecticut by area', landmark: 'the historic New Milford Green and scenic Housatonic River' },
  { name: 'Ridgefield', state: 'CT', pop: 25033, desc: 'an affluent Fairfield County town', landmark: 'the Aldrich Contemporary Art Museum and scenic Ridgefield Playhouse' },
  { name: 'Redding', state: 'CT', pop: 9158, desc: 'a scenic rural Fairfield County community', landmark: 'scenic Putnam Memorial State Park and Mark Twain Library' },
  { name: 'Monroe', state: 'CT', pop: 19412, desc: 'a Fairfield County residential community', landmark: 'Wolfe Park and scenic Webb Mountain' },
  { name: 'Trumbull', state: 'CT', pop: 36868, desc: 'a Fairfield County suburban community', landmark: 'the Westfield Trumbull mall and scenic Twin Brooks Park' },
  { name: 'Fairfield', state: 'CT', pop: 61512, desc: 'an affluent Fairfield County coastal town', landmark: 'Fairfield University and scenic Penfield Beach' },
  { name: 'Darien', state: 'CT', pop: 21499, desc: 'an affluent Gold Coast community', landmark: 'scenic Weed Beach and thriving downtown shopping' },
  { name: 'Greenwich', state: 'CT', pop: 63518, desc: 'one of the wealthiest towns in America', landmark: 'the Bruce Museum and scenic Greenwich Point Park' },
  { name: 'Old Lyme', state: 'CT', pop: 7628, desc: 'a historic Connecticut shoreline arts colony', landmark: 'the Florence Griswold Museum and American Impressionism heritage' },
  { name: 'Deep River', state: 'CT', pop: 4629, desc: 'a scenic Middlesex County river town', landmark: 'the Deep River Ancient Muster fife and drum festival' },
  { name: 'Thomaston', state: 'CT', pop: 7614, desc: 'a Litchfield County community', landmark: 'the Thomaston Opera House and historic Seth Thomas clock factory' },
  { name: 'Litchfield', state: 'CT', pop: 8192, desc: 'a quintessential New England village', landmark: 'the historic Litchfield Green and White Memorial Conservation Center' },
  { name: 'Simsbury', state: 'CT', pop: 24517, desc: 'a scenic Hartford County town', landmark: 'Talcott Mountain State Park and scenic Heublein Tower' },
  { name: 'Farmington', state: 'CT', pop: 26712, desc: 'a Hartford County suburban community', landmark: 'the Hill-Stead Museum and scenic Farmington River' },

  // ─── RHODE ISLAND ───────────────────────────────────────────────────────────
  { name: 'Providence', state: 'RI', pop: 190934, desc: 'the capital of Rhode Island', landmark: 'WaterFire installation, Brown University, and RISD' },
  { name: 'Warwick', state: 'RI', pop: 82823, desc: 'Rhode Island\'s second-largest city', landmark: 'T.F. Green International Airport and scenic Narragansett Bay shoreline' },
  { name: 'Cranston', state: 'RI', pop: 82934, desc: 'a vibrant community south of Providence', landmark: 'scenic Pawtuxet Village and Garden City Center' },
  { name: 'Pawtucket', state: 'RI', pop: 75604, desc: 'the birthplace of American industry', landmark: 'Slater Mill, America\'s first factory, and a revitalizing arts district' },
  { name: 'East Providence', state: 'RI', pop: 47139, desc: 'a waterfront community east of Providence', landmark: 'scenic Riverside and the East Bay Bike Path' },
  { name: 'Woonsocket', state: 'RI', pop: 43240, desc: 'a Blackstone Valley community', landmark: 'the Museum of Work and Culture and strong French-Canadian heritage' },
  { name: 'Newport', state: 'RI', pop: 25163, desc: 'America\'s sailing capital', landmark: 'the Gilded Age Newport Mansions and the Cliff Walk' },
  { name: 'Central Falls', state: 'RI', pop: 22583, desc: 'the smallest and most densely populated city in Rhode Island', landmark: 'a diverse community hub and historic mill village' },
  { name: 'Cumberland', state: 'RI', pop: 36405, desc: 'a scenic northern Rhode Island community', landmark: 'Diamond Hill State Park and scenic reservoirs' },
  { name: 'North Providence', state: 'RI', pop: 34366, desc: 'a Providence suburb', landmark: 'scenic Wenscott Reservoir and family-friendly neighborhoods' },
  { name: 'South Kingstown', state: 'RI', pop: 31765, desc: 'a coastal community in Washington County', landmark: 'the University of Rhode Island and scenic Narragansett beaches' },
  { name: 'North Kingstown', state: 'RI', pop: 27673, desc: 'a scenic Narragansett Bay community', landmark: 'Wickford Village and the historic Quonset Point' },
  { name: 'West Warwick', state: 'RI', pop: 29078, desc: 'a Kent County community', landmark: 'the Arctic and Phenix mill village areas' },
  { name: 'Coventry', state: 'RI', pop: 35014, desc: 'the largest town in Rhode Island by area', landmark: 'scenic Tiogue Lake and the Anthony Village area' },
  { name: 'Johnston', state: 'RI', pop: 29568, desc: 'a Providence suburb in western Rhode Island', landmark: 'scenic Snake Den State Park and Atwood Avenue commercial district' },
  { name: 'Lincoln', state: 'RI', pop: 22529, desc: 'a northern Rhode Island community', landmark: 'Lincoln Woods State Park and the historic Lime Rock Village' },
  { name: 'Smithfield', state: 'RI', pop: 22043, desc: 'a northwestern Rhode Island community', landmark: 'Bryant University and scenic Georgiaville Pond' },
  { name: 'Bristol', state: 'RI', pop: 22493, desc: 'a historic Narragansett Bay town', landmark: 'the oldest Fourth of July celebration in America and Roger Williams University' },
  { name: 'Barrington', state: 'RI', pop: 17115, desc: 'an affluent East Bay community', landmark: 'scenic Barrington Beach and top-rated public schools' },
  { name: 'East Greenwich', state: 'RI', pop: 13590, desc: 'a charming Kent County community', landmark: 'historic Main Street shopping district and scenic Greenwich Bay' },
  { name: 'West Greenwich', state: 'RI', pop: 6424, desc: 'a rural Kent County community', landmark: 'scenic Wickaboxet State Forest and Big River Management Area' },
  { name: 'Exeter', state: 'RI', pop: 6600, desc: 'a rural Washington County community', landmark: 'scenic Arcadia Management Area and Browning Mill Pond' },
  { name: 'Richmond', state: 'RI', pop: 7925, desc: 'a Washington County rural community', landmark: 'scenic Carolina Management Area and Wood River' },
  { name: 'Charlestown', state: 'RI', pop: 7683, desc: 'a Washington County coastal community', landmark: 'Ninigret National Wildlife Refuge and scenic salt ponds' },
  { name: 'Westerly', state: 'RI', pop: 22787, desc: 'a coastal community on the Connecticut border', landmark: 'Watch Hill and the beautiful Misquamicut State Beach' },
  { name: 'Narragansett', state: 'RI', pop: 15868, desc: 'a scenic oceanside community', landmark: 'Narragansett Town Beach and the iconic Towers landmark' },
  { name: 'North Smithfield', state: 'RI', pop: 13014, desc: 'a northern Rhode Island community', landmark: 'scenic Primrose Pond and Blackstone River valley' },
  { name: 'Burrillville', state: 'RI', pop: 16975, desc: 'a rural northwestern Rhode Island community', landmark: 'Pulaski State Park and scenic Pascoag Reservoir' },
  { name: 'Glocester', state: 'RI', pop: 10063, desc: 'a scenic northwestern Rhode Island town', landmark: 'Casimir Pulaski Memorial State Park and scenic Chepachet Village' },
  { name: 'Scituate', state: 'RI', pop: 10757, desc: 'a scenic rural Rhode Island community', landmark: 'the Scituate Reservoir, providing water for most of Rhode Island' },
  { name: 'Foster', state: 'RI', pop: 4688, desc: 'a rural western Rhode Island community', landmark: 'scenic woodland preserves and quiet country roads' },
  { name: 'Tiverton', state: 'RI', pop: 15780, desc: 'a Sakonnet River waterfront community', landmark: 'scenic Tiverton Four Corners and the Sakonnet Vineyards' },
  { name: 'Little Compton', state: 'RI', pop: 3617, desc: 'a pastoral coastal community', landmark: 'scenic Sakonnet Point and Carolyn\'s Sakonnet Vineyard' },
  { name: 'Middletown', state: 'RI', pop: 17124, desc: 'a Newport County community', landmark: 'scenic Second Beach and Sachuest Point National Wildlife Refuge' },
  { name: 'Portsmouth', state: 'RI', pop: 17670, desc: 'a scenic Aquidneck Island community', landmark: 'Green Animals Topiary Garden and scenic shoreline' },
  { name: 'Jamestown', state: 'RI', pop: 5622, desc: 'a scenic island community in Narragansett Bay', landmark: 'Beavertail State Park and the Jamestown Windmill' },

  // ─── SOUTHERN NEW HAMPSHIRE ─────────────────────────────────────────────────
  { name: 'Nashua', state: 'NH', pop: 91322, desc: 'the Gate City of New Hampshire', landmark: 'a thriving downtown Main Street and the Mine Falls Park trail system' },
  { name: 'Manchester', state: 'NH', pop: 115644, desc: 'the largest city in New Hampshire', landmark: 'the historic Amoskeag Mill Yard and the Currier Museum of Art' },
  { name: 'Concord', state: 'NH', pop: 43976, desc: 'the capital of New Hampshire', landmark: 'the State House, the oldest state capitol building in which a legislature still meets' },
  { name: 'Dover', state: 'NH', pop: 32741, desc: 'a historic Seacoast Region city', landmark: 'the Children\'s Museum of New Hampshire and Cochecho River waterfront' },
  { name: 'Rochester', state: 'NH', pop: 31366, desc: 'the Lilac City', landmark: 'the Rochester Fair and scenic Cocheco River' },
  { name: 'Keene', state: 'NH', pop: 23409, desc: 'the Elm City in southwestern New Hampshire', landmark: 'Keene State College and a vibrant downtown Main Street' },
  { name: 'Laconia', state: 'NH', pop: 16871, desc: 'the gateway to the Lakes Region', landmark: 'scenic Lake Winnipesaukee access and Motorcycle Week' },
  { name: 'Lebanon', state: 'NH', pop: 14282, desc: 'an upper Connecticut River valley city', landmark: 'proximity to Dartmouth-Hitchcock Medical Center and the Appalachian Trail' },
  { name: 'Claremont', state: 'NH', pop: 13199, desc: 'a Connecticut River mill city', landmark: 'historic Claremont Opera House and the Sugar River Trail' },
  { name: 'Portsmouth', state: 'NH', pop: 22158, desc: 'a vibrant Seacoast city', landmark: 'the Strawbery Banke Museum and a renowned restaurant scene' },
  { name: 'Salem', state: 'NH', pop: 29874, desc: 'a commercial hub on the Massachusetts border', landmark: 'the Tuscan Village development and Canobie Lake Park' },
  { name: 'Derry', state: 'NH', pop: 33981, desc: 'a Rockingham County community', landmark: 'Robert Frost Farm and the Pinkerton Academy' },
  { name: 'Londonderry', state: 'NH', pop: 26233, desc: 'a growing Rockingham County community', landmark: 'scenic apple orchards and Londonderry town common' },
  { name: 'Hudson', state: 'NH', pop: 25935, desc: 'a Hillsborough County community south of Manchester', landmark: 'Benson Park and scenic Merrimack River frontage' },
  { name: 'Litchfield', state: 'NH', pop: 8615, desc: 'a scenic Hillsborough County community', landmark: 'scenic Merrimack River views and a small-town atmosphere' },
  { name: 'Merrimack', state: 'NH', pop: 26017, desc: 'a Hillsborough County community', landmark: 'the Anheuser-Busch brewery and Merrimack Premium Outlets' },
  { name: 'Milford', state: 'NH', pop: 15990, desc: 'the Granite Town', landmark: 'the Milford Oval and scenic Souhegan River' },
  { name: 'Amherst', state: 'NH', pop: 11753, desc: 'a scenic southern New Hampshire community', landmark: 'the Amherst Village Green and scenic Ponemah Bog' },
  { name: 'Bedford', state: 'NH', pop: 23322, desc: 'an affluent Manchester suburb', landmark: 'top-rated schools and scenic conservation lands' },
  { name: 'Goffstown', state: 'NH', pop: 18577, desc: 'a Hillsborough County community along the Piscataquog River', landmark: 'Saint Anselm College and scenic Uncanoonuc Mountains' },
  { name: 'Hooksett', state: 'NH', pop: 14871, desc: 'a Merrimack Valley community', landmark: 'the Hooksett Toll Plazas area and scenic Merrimack River' },
  { name: 'Bow', state: 'NH', pop: 8107, desc: 'a scenic community south of Concord', landmark: 'scenic rural landscapes and convenient access to I-93' },
  { name: 'Pembroke', state: 'NH', pop: 7157, desc: 'a Merrimack County community', landmark: 'scenic Suncook River and the Pembroke Academy' },
  { name: 'Epsom', state: 'NH', pop: 4801, desc: 'a rural Merrimack County community', landmark: 'New Hampshire Motor Speedway at Loudon nearby and scenic lakes' },
  { name: 'Pittsfield', state: 'NH', pop: 4106, desc: 'a small Merrimack County community', landmark: 'scenic Suncook River valley and the historic Pittsfield town center' },
  { name: 'Gilford', state: 'NH', pop: 7601, desc: 'a Lakes Region community', landmark: 'Gunstock Mountain Resort and scenic Lake Winnipesaukee beaches' },
  { name: 'Meredith', state: 'NH', pop: 6662, desc: 'a Lakes Region resort community', landmark: 'scenic Lake Winnipesaukee waterfront and the Mill Falls marketplace' },
  { name: 'Wolfeboro', state: 'NH', pop: 6327, desc: 'the oldest summer resort in America', landmark: 'scenic Lake Winnipesaukee shoreline and charming downtown' },
  { name: 'Hampton', state: 'NH', pop: 16002, desc: 'a popular New Hampshire Seacoast community', landmark: 'Hampton Beach and the Hampton Beach Casino Ballroom' },
  { name: 'Exeter', state: 'NH', pop: 16005, desc: 'a historic Seacoast Region town', landmark: 'Phillips Exeter Academy and a charming downtown district' },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const services = {
  'crm-automation': {
    title: 'CRM & Sales Automation',
    shortTitle: 'CRM & Automation',
    icon: 'fas fa-gears',
    color: 'var(--accent-gold)',
    btnClass: 'btn-primary',
    features: [
      { icon: 'fas fa-database', title: 'CRM Setup & Customization', desc: 'Centralize all customer data, track leads, and manage your sales pipeline in one place.' },
      { icon: 'fas fa-funnel-dollar', title: 'Sales Funnel Automation', desc: 'Build high-converting funnels that capture, nurture, and close leads on autopilot.' },
      { icon: 'fas fa-chart-line', title: 'Performance Dashboards', desc: 'Real-time analytics and reporting so you always know what\'s working.' },
      { icon: 'fas fa-robot', title: 'Workflow Automation', desc: 'Eliminate repetitive tasks with smart automations that save 15+ hours per week.' },
      { icon: 'fas fa-envelope-open-text', title: 'Automated Follow-Ups', desc: 'Never lose a lead again with email, SMS, and WhatsApp sequences.' },
      { icon: 'fas fa-calendar-check', title: 'Appointment Scheduling', desc: 'Let customers book online, reducing phone tag and no-shows.' },
    ],
    stats: [
      { icon: 'fas fa-arrow-trend-up', text: '40% avg. increase in lead conversions' },
      { icon: 'fas fa-clock', text: '15+ hours saved per week' },
      { icon: 'fas fa-dollar-sign', text: '3x avg. ROI in 6 months' },
    ],
    process: [
      { icon: 'fas fa-magnifying-glass', title: 'Audit & Strategy', desc: 'We analyze your current sales process, identify bottlenecks, and design a custom CRM roadmap.' },
      { icon: 'fas fa-wrench', title: 'Build & Integrate', desc: 'We set up your CRM, import contacts, build automations, and connect your tools.' },
      { icon: 'fas fa-rocket', title: 'Launch & Optimize', desc: 'We train your team, go live, and continuously optimize for better results.' },
    ],
  },
  'seo-marketing': {
    title: 'SEO & Digital Marketing',
    shortTitle: 'SEO & Marketing',
    icon: 'fas fa-bullhorn',
    color: 'var(--secondary-green)',
    btnClass: 'btn-green',
    features: [
      { icon: 'fas fa-search', title: 'Local SEO & Google Business', desc: 'Dominate local search results and appear in Google\'s top 3 map pack.' },
      { icon: 'fas fa-share-nodes', title: 'Social Media Management', desc: 'Content creation, community management, and paid social advertising.' },
      { icon: 'fas fa-envelope', title: 'Email, SMS & WhatsApp Campaigns', desc: 'Multi-channel outreach that converts leads into customers.' },
      { icon: 'fas fa-rectangle-ad', title: 'Google & Facebook Ads', desc: 'Targeted paid advertising campaigns with measurable ROI.' },
      { icon: 'fas fa-mail-bulk', title: 'EDDM & Direct Mail', desc: 'Targeted neighborhood postcards and mailers that get noticed.' },
      { icon: 'fas fa-pen-fancy', title: 'Content Marketing', desc: 'Blog posts, videos, and infographics that build authority and attract organic traffic.' },
    ],
    stats: [
      { icon: 'fas fa-search', text: 'Top 3 Google rankings in 90 days' },
      { icon: 'fas fa-users', text: '200% avg. increase in website traffic' },
      { icon: 'fas fa-chart-line', text: '5x more inbound leads' },
    ],
    process: [
      { icon: 'fas fa-clipboard-list', title: 'Research & Audit', desc: 'We audit your online presence, research competitors, and identify keyword opportunities.' },
      { icon: 'fas fa-bullseye', title: 'Strategy & Execution', desc: 'We implement on-page SEO, create content, launch campaigns, and optimize your profiles.' },
      { icon: 'fas fa-chart-pie', title: 'Report & Scale', desc: 'Monthly reports showing real results, with continuous refinement to maximize ROI.' },
    ],
  },
  'it-support': {
    title: 'IT Support & Tech Solutions',
    shortTitle: 'IT & Tech Support',
    icon: 'fas fa-shield-halved',
    color: 'var(--primary-navy)',
    btnClass: 'btn-primary',
    features: [
      { icon: 'fas fa-headset', title: 'IT Support & Troubleshooting', desc: 'Fast, reliable tech support when you need it — same-day response guaranteed.' },
      { icon: 'fas fa-camera', title: 'Security Camera Systems', desc: 'Professional surveillance installation for homes and businesses.' },
      { icon: 'fas fa-laptop-code', title: 'Website Development', desc: 'Fast, modern, mobile-friendly websites optimized for conversions.' },
      { icon: 'fas fa-palette', title: 'Branding & Identity', desc: 'Logos, business cards, vehicle wraps, and complete brand packages.' },
      { icon: 'fas fa-network-wired', title: 'Network Setup & Maintenance', desc: 'Wired and wireless network solutions for reliable connectivity.' },
      { icon: 'fas fa-cloud', title: 'Cloud & Backup Solutions', desc: 'Secure cloud migration, data backup, and disaster recovery planning.' },
    ],
    stats: [
      { icon: 'fas fa-bolt', text: 'Same-day support response' },
      { icon: 'fas fa-camera', text: 'Professional-grade security installs' },
      { icon: 'fas fa-palette', text: 'Complete brand identity packages' },
    ],
    process: [
      { icon: 'fas fa-phone', title: 'Consult & Assess', desc: 'We evaluate your tech needs, security concerns, and growth goals.' },
      { icon: 'fas fa-tools', title: 'Implement & Install', desc: 'We deploy solutions, install equipment, and configure everything for peak performance.' },
      { icon: 'fas fa-life-ring', title: 'Support & Maintain', desc: 'Ongoing maintenance, monitoring, and support to keep your business running smoothly.' },
    ],
  },
};

// ─── INDUSTRIES ───────────────────────────────────────────────────────────────
const industries = [
  { icon: 'fas fa-hard-hat', name: 'Construction', desc: 'General contractors, home builders, and renovation specialists' },
  { icon: 'fas fa-paint-roller', name: 'Painting', desc: 'Interior and exterior painting contractors' },
  { icon: 'fas fa-broom', name: 'Cleaning', desc: 'Residential and commercial cleaning companies' },
  { icon: 'fas fa-house-chimney', name: 'Roofing', desc: 'Roofing contractors and siding installers' },
  { icon: 'fas fa-leaf', name: 'Landscaping', desc: 'Landscapers, lawn care, and hardscaping professionals' },
  { icon: 'fas fa-plug', name: 'Electrical', desc: 'Licensed electricians and electrical contractors' },
  { icon: 'fas fa-wrench', name: 'Plumbing', desc: 'Plumbers and HVAC technicians' },
  { icon: 'fas fa-hammer', name: 'Carpentry', desc: 'Carpenters, cabinetmakers, and woodworkers' },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Jose B.', business: 'JB Construction', text: 'Galaxy IT set up our CRM and now we never lose a lead. Our close rate went up 35% in the first three months.', rating: 5 },
  { name: 'Maria K.', business: 'MK Cleaning Services', text: 'Our Google rankings went from page 3 to the top 3. We\'re getting calls every day now. Best investment we ever made.', rating: 5 },
  { name: 'Rafael A.', business: 'RA Painting Co.', text: 'They built our website, set up our CRM, and manage our social media. One team, everything handled. Highly recommend.', rating: 5 },
  { name: 'Ana S.', business: 'Sparkling Clean LLC', text: 'Galaxy IT understands the home-service industry. They speak our language and deliver real results. Five stars.', rating: 5 },
];

// ─── CONTENT VARIATION HELPERS ────────────────────────────────────────────────
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// ─── STATE HELPERS ───────────────────────────────────────────────────────────
const stateFullNames = { MA: 'Massachusetts', CT: 'Connecticut', RI: 'Rhode Island', NH: 'New Hampshire' };
function getStateAbbr(city) { return (city.state || 'MA').toUpperCase(); }
function getStateFull(city) { return stateFullNames[getStateAbbr(city)]; }
function getStateSlug(city) { return getStateAbbr(city).toLowerCase(); }

// Varied intro paragraphs per service+city
function getIntroParagraph(svcKey, city) {
  const h = Math.abs(hashStr(city.name + svcKey)) % 5;
  const svc = services[svcKey];
  const intros = {
    'crm-automation': [
      `Small businesses in ${city.name}, ${getStateAbbr(city)} are losing thousands of dollars every month to disorganized leads and manual follow-ups. Galaxy IT & Marketing provides professional CRM and sales automation solutions that help ${city.name} contractors, cleaners, and home-service companies capture every lead, automate follow-ups, and close more deals — without hiring extra staff.`,
      `If you run a home-service business in ${city.name}, ${getStateFull(city)}, you know how hard it is to keep track of leads, estimates, and follow-ups. Galaxy IT & Marketing deploys custom CRM systems built specifically for contractors, painters, and service professionals in ${city.name} and surrounding areas — so you can stop losing leads and start growing faster.`,
      `${city.name} is ${city.desc}, and the local service businesses here deserve technology that matches their ambition. Galaxy IT & Marketing brings enterprise-grade CRM and automation tools to small businesses in ${city.name}, ${getStateAbbr(city)} — at prices that make sense for contractors, cleaners, roofers, and landscapers.`,
      `For home-service businesses in ${city.name}, ${getStateAbbr(city)}, managing customer relationships manually is costing you time and money. Galaxy IT & Marketing specializes in CRM setup and sales automation for ${city.name}-area contractors, painters, and service providers. We help you organize your leads, automate your pipeline, and grow your revenue.`,
      `The competition among home-service businesses in ${city.name}, ${getStateFull(city)} is fierce. Galaxy IT & Marketing gives you the edge with smart CRM systems and sales automation that turn inquiries into booked jobs. Serving businesses in ${city.name} and throughout ${getStateFull(city)}, we deliver measurable results.`,
    ],
    'seo-marketing': [
      `When homeowners in ${city.name}, ${getStateAbbr(city)} search for a contractor, painter, or cleaning service, will they find your business? Galaxy IT & Marketing provides expert SEO and digital marketing services that put ${city.name} home-service businesses at the top of Google — where your customers are looking.`,
      `${city.name} is ${city.desc}, and its local businesses deserve a digital presence that matches the community's energy. Galaxy IT & Marketing helps contractors, cleaners, and service companies in ${city.name}, ${getStateFull(city)} dominate local search results, attract more leads, and grow through proven digital marketing strategies.`,
      `Most home-service businesses in ${city.name}, ${getStateAbbr(city)} are invisible online. Galaxy IT & Marketing changes that. We provide comprehensive SEO, Google Business optimization, social media management, and paid advertising for contractors, painters, landscapers, and more throughout ${city.name} and the surrounding area.`,
      `If your ${city.name} home-service business isn't showing up on the first page of Google, you're handing customers to your competitors. Galaxy IT & Marketing delivers local SEO and digital marketing solutions designed specifically for service businesses in ${city.name}, ${getStateFull(city)} — with measurable results in 90 days or less.`,
      `For contractors and home-service companies in ${city.name}, ${getStateAbbr(city)}, effective digital marketing isn't optional — it's essential. Galaxy IT & Marketing combines local SEO expertise, social media management, and targeted advertising to help ${city.name} businesses attract more customers and grow their revenue.`,
    ],
    'it-support': [
      `Running a business in ${city.name}, ${getStateAbbr(city)} means you need technology that works as hard as you do. Galaxy IT & Marketing provides reliable IT support, security camera installation, website development, and tech solutions for home-service businesses throughout ${city.name} and the surrounding area.`,
      `${city.name} is ${city.desc}, and its growing business community needs dependable technology partners. Galaxy IT & Marketing delivers same-day IT support, professional security systems, modern websites, and complete branding packages for contractors, cleaners, and service professionals in ${city.name}, ${getStateFull(city)}.`,
      `Technology problems cost ${city.name} businesses time and money every day. Galaxy IT & Marketing provides fast, affordable IT support and tech solutions designed for home-service companies in ${city.name}, ${getStateAbbr(city)} — from network setup and security cameras to website development and brand identity.`,
      `For home-service businesses in ${city.name}, ${getStateFull(city)}, having the right technology infrastructure is the difference between struggling and scaling. Galaxy IT & Marketing offers comprehensive IT support, security installations, web development, and branding for contractors and service companies throughout ${city.name}.`,
      `Small businesses in ${city.name}, ${getStateAbbr(city)} need a technology partner who understands their industry. Galaxy IT & Marketing provides hands-on IT support, professional-grade security camera systems, high-performance websites, and complete branding solutions for home-service companies in ${city.name} and beyond.`,
    ],
  };
  return intros[svcKey][h];
}

function getWhyChooseItems(svcKey, city) {
  const base = [
    { icon: 'fas fa-map-marker-alt', title: `Local to ${city.name}`, desc: `We know the ${city.name} market, its neighborhoods, and what local customers are searching for.` },
    { icon: 'fas fa-users', title: 'Built for Home Services', desc: 'We specialize in contractors, painters, cleaners, roofers, landscapers, and similar trades.' },
    { icon: 'fas fa-language', title: 'Multilingual Team', desc: `We serve English, Spanish, and Portuguese-speaking business owners throughout ${getStateFull(city)} and New England.` },
    { icon: 'fas fa-award', title: '19+ Years Experience', desc: 'Since 2006, we\'ve helped hundreds of New England businesses grow with technology and marketing.' },
  ];
  if (svcKey === 'crm-automation') {
    base.push({ icon: 'fas fa-handshake', title: 'No Long-Term Contracts', desc: 'Month-to-month service. We earn your business every single month.' });
    base.push({ icon: 'fas fa-graduation-cap', title: 'Full Training Included', desc: 'We don\'t just set up your CRM — we train your entire team to use it effectively.' });
  } else if (svcKey === 'seo-marketing') {
    base.push({ icon: 'fas fa-chart-bar', title: 'Transparent Reporting', desc: 'Monthly reports with real metrics — rankings, traffic, leads, and ROI. No vanity numbers.' });
    base.push({ icon: 'fas fa-bullseye', title: 'Results in 90 Days', desc: 'Our clients typically see first-page Google rankings within 90 days of starting.' });
  } else {
    base.push({ icon: 'fas fa-bolt', title: 'Same-Day Response', desc: 'When tech problems strike, we respond the same day — because downtime costs you money.' });
    base.push({ icon: 'fas fa-shield-alt', title: 'Security Experts', desc: 'Professional-grade security camera systems installed and monitored for your peace of mind.' });
  }
  return base;
}

function getFAQs(svcKey, city) {
  const svc = services[svcKey];
  return [
    {
      q: `How much does ${svc.shortTitle.toLowerCase()} cost in ${city.name}, ${getStateAbbr(city)}?`,
      a: `Our ${svc.shortTitle.toLowerCase()} services for ${city.name} businesses start at competitive rates tailored to small and mid-size companies. We offer free assessments and custom quotes based on your specific needs, business size, and goals. Most home-service businesses in ${city.name} invest between $500 and $2,500 per month depending on the scope of services. Contact us for a free, no-obligation assessment.`,
    },
    {
      q: `What is the best ${svc.shortTitle.toLowerCase()} provider in ${city.name}?`,
      a: `Galaxy IT & Marketing is the top-rated ${svc.shortTitle.toLowerCase()} provider serving ${city.name}, ${getStateFull(city)}. With 19+ years of experience, a 4.9-star rating, and deep expertise in home-service businesses like construction, painting, cleaning, and landscaping, we deliver measurable results for ${city.name}-area companies. Our bilingual team serves English, Spanish, and Portuguese-speaking business owners.`,
    },
    {
      q: `Do you serve businesses in the ${city.name} area?`,
      a: `Yes. Galaxy IT & Marketing proudly serves businesses in ${city.name}, ${getStateAbbr(city)} and all surrounding communities. We are based in Worcester and provide on-site and remote services throughout ${getStateFull(city)} and New England. Whether you need in-person consultations or remote support, we cover the entire ${city.name} area.`,
    },
    {
      q: `How quickly can I see results from ${svc.shortTitle.toLowerCase()} in ${city.name}?`,
      a: svcKey === 'crm-automation'
        ? `Most ${city.name} businesses see measurable improvements within 2 to 4 weeks of CRM implementation. Lead response times drop dramatically, follow-up rates increase, and our clients typically report a 40% boost in conversions within the first 90 days.`
        : svcKey === 'seo-marketing'
        ? `SEO results for ${city.name} businesses typically begin showing within 30 to 60 days, with significant ranking improvements by the 90-day mark. Paid advertising campaigns generate leads within the first week. Our ${city.name} clients average a 200% increase in website traffic within 6 months.`
        : `IT support is available same-day for ${city.name} businesses. Security camera installations are typically completed within 1 to 3 business days. Website development projects take 2 to 4 weeks depending on complexity. We prioritize fast turnaround so your ${city.name} business stays productive.`,
    },
    {
      q: `Why should a ${city.name} home-service business invest in ${svc.shortTitle.toLowerCase()}?`,
      a: svcKey === 'crm-automation'
        ? `Home-service businesses in ${city.name} that use CRM systems close 30-40% more leads than those relying on spreadsheets or memory. A CRM organizes your contacts, automates follow-ups, and ensures no lead falls through the cracks — critical in ${city.name}'s competitive contractor market.`
        : svcKey === 'seo-marketing'
        ? `97% of consumers search online before hiring a local service provider. If your ${city.name} business isn't visible on Google, you're losing customers to competitors who are. Professional SEO and digital marketing put your business in front of homeowners actively looking for your services in ${city.name}.`
        : `Technology failures cost small businesses an average of $8,000 per incident. For ${city.name} home-service companies, reliable IT support, a professional website, and proper security protect your reputation and keep projects on track. Investing in tech solutions pays for itself quickly.`,
    },
  ];
}

function getNearbyLinks(city, svcKey) {
  const slug = slugify(city.name);
  const nearby = cities
    .filter(c => c.name !== city.name)
    .sort(() => hashStr(city.name + svcKey) % 2 === 0 ? 1 : -1)
    .slice(0, 6);
  return nearby.map(c => ({
    name: c.name,
    slug: slugify(c.name),
    state: getStateSlug(c),
    url: `/cities/${svcKey}-${slugify(c.name)}-${getStateSlug(c)}.html`,
  }));
}

// ─── SERVICE NAME TRANSLATIONS ───────────────────────────────────────────────
const serviceNames = {
  'crm-automation': { en: 'CRM & Sales Automation', es: 'CRM y Automatización de Ventas', pt: 'CRM e Automação de Vendas' },
  'seo-marketing': { en: 'SEO & Digital Marketing', es: 'SEO y Marketing Digital', pt: 'SEO e Marketing Digital' },
  'it-support': { en: 'IT Support & Tech Solutions', es: 'Soporte IT y Soluciones Tecnológicas', pt: 'Suporte de TI e Soluções Tecnológicas' },
};

const serviceShortNames = {
  'crm-automation': { en: 'CRM & Automation', es: 'CRM y Automatización', pt: 'CRM e Automação' },
  'seo-marketing': { en: 'SEO & Marketing', es: 'SEO y Marketing', pt: 'SEO e Marketing' },
  'it-support': { en: 'IT & Tech Support', es: 'Soporte IT y Tecnología', pt: 'Suporte de TI e Tecnologia' },
};

// ─── TRANSLATED INTRO PARAGRAPHS ─────────────────────────────────────────────
function getIntroParagraphES(svcKey, city) {
  const h = Math.abs(hashStr(city.name + svcKey)) % 5;
  const intros = {
    'crm-automation': [
      `Las pequeñas empresas en ${city.name}, ${getStateAbbr(city)} están perdiendo miles de dólares cada mes por leads desorganizados y seguimientos manuales. Galaxy IT & Marketing ofrece soluciones profesionales de CRM y automatización de ventas que ayudan a contratistas, limpiadores y empresas de servicios del hogar en ${city.name} a capturar cada lead, automatizar seguimientos y cerrar más negocios — sin contratar personal adicional.`,
      `Si tienes un negocio de servicios del hogar en ${city.name}, ${getStateFull(city)}, sabes lo difícil que es rastrear leads, presupuestos y seguimientos. Galaxy IT & Marketing implementa sistemas CRM personalizados diseñados específicamente para contratistas, pintores y profesionales de servicios en ${city.name} y áreas cercanas — para que dejes de perder leads y comiences a crecer más rápido.`,
      `${city.name} es ${city.desc}, y las empresas de servicios locales aquí merecen tecnología que iguale su ambición. Galaxy IT & Marketing lleva herramientas de CRM y automatización de nivel empresarial a pequeñas empresas en ${city.name}, ${getStateAbbr(city)} — a precios que tienen sentido para contratistas, limpiadores, techadores y paisajistas.`,
      `Para empresas de servicios del hogar en ${city.name}, ${getStateAbbr(city)}, gestionar relaciones con clientes manualmente te está costando tiempo y dinero. Galaxy IT & Marketing se especializa en configuración de CRM y automatización de ventas para contratistas, pintores y proveedores de servicios en el área de ${city.name}. Te ayudamos a organizar tus leads, automatizar tu pipeline y hacer crecer tus ingresos.`,
      `La competencia entre empresas de servicios del hogar en ${city.name}, ${getStateFull(city)} es feroz. Galaxy IT & Marketing te da la ventaja con sistemas CRM inteligentes y automatización de ventas que convierten consultas en trabajos agendados. Sirviendo a empresas en ${city.name} y en todo ${getStateFull(city)}, entregamos resultados medibles.`,
    ],
    'seo-marketing': [
      `Cuando los propietarios en ${city.name}, ${getStateAbbr(city)} buscan un contratista, pintor o servicio de limpieza, ¿encontrarán tu negocio? Galaxy IT & Marketing ofrece servicios expertos de SEO y marketing digital que posicionan a las empresas de servicios del hogar de ${city.name} en los primeros resultados de Google — donde tus clientes están buscando.`,
      `${city.name} es ${city.desc}, y sus negocios locales merecen una presencia digital que iguale la energía de la comunidad. Galaxy IT & Marketing ayuda a contratistas, limpiadores y empresas de servicios en ${city.name}, ${getStateFull(city)} a dominar los resultados de búsqueda local, atraer más leads y crecer mediante estrategias de marketing digital comprobadas.`,
      `La mayoría de las empresas de servicios del hogar en ${city.name}, ${getStateAbbr(city)} son invisibles en línea. Galaxy IT & Marketing cambia eso. Ofrecemos SEO integral, optimización de Google Business, gestión de redes sociales y publicidad pagada para contratistas, pintores, paisajistas y más en ${city.name} y alrededores.`,
      `Si tu empresa de servicios del hogar en ${city.name} no aparece en la primera página de Google, estás entregando clientes a tu competencia. Galaxy IT & Marketing ofrece soluciones de SEO local y marketing digital diseñadas específicamente para empresas de servicios en ${city.name}, ${getStateFull(city)} — con resultados medibles en 90 días o menos.`,
      `Para contratistas y empresas de servicios del hogar en ${city.name}, ${getStateAbbr(city)}, el marketing digital efectivo no es opcional — es esencial. Galaxy IT & Marketing combina experiencia en SEO local, gestión de redes sociales y publicidad dirigida para ayudar a las empresas de ${city.name} a atraer más clientes y aumentar sus ingresos.`,
    ],
    'it-support': [
      `Dirigir un negocio en ${city.name}, ${getStateAbbr(city)} significa que necesitas tecnología que trabaje tan duro como tú. Galaxy IT & Marketing ofrece soporte IT confiable, instalación de cámaras de seguridad, desarrollo web y soluciones tecnológicas para empresas de servicios del hogar en ${city.name} y alrededores.`,
      `${city.name} es ${city.desc}, y su creciente comunidad empresarial necesita socios tecnológicos confiables. Galaxy IT & Marketing ofrece soporte IT el mismo día, sistemas de seguridad profesionales, sitios web modernos y paquetes de branding completos para contratistas, limpiadores y profesionales de servicios en ${city.name}, ${getStateFull(city)}.`,
      `Los problemas tecnológicos les cuestan a las empresas de ${city.name} tiempo y dinero cada día. Galaxy IT & Marketing ofrece soporte IT rápido y asequible y soluciones tecnológicas diseñadas para empresas de servicios del hogar en ${city.name}, ${getStateAbbr(city)} — desde configuración de redes y cámaras de seguridad hasta desarrollo web e identidad de marca.`,
      `Para empresas de servicios del hogar en ${city.name}, ${getStateFull(city)}, tener la infraestructura tecnológica correcta es la diferencia entre estancarse y escalar. Galaxy IT & Marketing ofrece soporte IT integral, instalaciones de seguridad, desarrollo web y branding para contratistas y empresas de servicios en ${city.name}.`,
      `Las pequeñas empresas en ${city.name}, ${getStateAbbr(city)} necesitan un socio tecnológico que entienda su industria. Galaxy IT & Marketing ofrece soporte IT práctico, sistemas de cámaras de seguridad profesionales, sitios web de alto rendimiento y soluciones de branding completas para empresas de servicios del hogar en ${city.name} y más allá.`,
    ],
  };
  return intros[svcKey][h];
}

function getIntroParagraphPT(svcKey, city) {
  const h = Math.abs(hashStr(city.name + svcKey)) % 5;
  const intros = {
    'crm-automation': [
      `Pequenas empresas em ${city.name}, ${getStateAbbr(city)} estão perdendo milhares de dólares todo mês por causa de leads desorganizados e acompanhamentos manuais. A Galaxy IT & Marketing oferece soluções profissionais de CRM e automação de vendas que ajudam empreiteiros, faxineiros e empresas de serviços residenciais em ${city.name} a capturar cada lead, automatizar acompanhamentos e fechar mais negócios — sem contratar funcionários extras.`,
      `Se você tem um negócio de serviços residenciais em ${city.name}, ${getStateFull(city)}, sabe como é difícil acompanhar leads, orçamentos e follow-ups. A Galaxy IT & Marketing implanta sistemas CRM personalizados criados especificamente para empreiteiros, pintores e profissionais de serviços em ${city.name} e arredores — para que você pare de perder leads e comece a crescer mais rápido.`,
      `${city.name} é ${city.desc}, e as empresas de serviços locais aqui merecem tecnologia que acompanhe sua ambição. A Galaxy IT & Marketing traz ferramentas de CRM e automação de nível empresarial para pequenas empresas em ${city.name}, ${getStateAbbr(city)} — a preços que fazem sentido para empreiteiros, faxineiros, telhadores e paisagistas.`,
      `Para empresas de serviços residenciais em ${city.name}, ${getStateAbbr(city)}, gerenciar relacionamentos com clientes manualmente está custando tempo e dinheiro. A Galaxy IT & Marketing é especialista em configuração de CRM e automação de vendas para empreiteiros, pintores e prestadores de serviços na área de ${city.name}. Ajudamos você a organizar seus leads, automatizar seu pipeline e aumentar sua receita.`,
      `A concorrência entre empresas de serviços residenciais em ${city.name}, ${getStateFull(city)} é acirrada. A Galaxy IT & Marketing oferece a vantagem com sistemas CRM inteligentes e automação de vendas que transformam consultas em trabalhos agendados. Atendendo empresas em ${city.name} e em todo ${getStateFull(city)}, entregamos resultados mensuráveis.`,
    ],
    'seo-marketing': [
      `Quando os moradores de ${city.name}, ${getStateAbbr(city)} procuram um empreiteiro, pintor ou serviço de limpeza, eles encontrarão seu negócio? A Galaxy IT & Marketing oferece serviços especializados de SEO e marketing digital que colocam as empresas de serviços residenciais de ${city.name} no topo do Google — onde seus clientes estão procurando.`,
      `${city.name} é ${city.desc}, e seus negócios locais merecem uma presença digital que acompanhe a energia da comunidade. A Galaxy IT & Marketing ajuda empreiteiros, faxineiros e empresas de serviços em ${city.name}, ${getStateFull(city)} a dominar os resultados de busca local, atrair mais leads e crescer por meio de estratégias de marketing digital comprovadas.`,
      `A maioria das empresas de serviços residenciais em ${city.name}, ${getStateAbbr(city)} é invisível online. A Galaxy IT & Marketing muda isso. Oferecemos SEO abrangente, otimização do Google Meu Negócio, gestão de mídias sociais e publicidade paga para empreiteiros, pintores, paisagistas e mais em ${city.name} e arredores.`,
      `Se sua empresa de serviços residenciais em ${city.name} não aparece na primeira página do Google, você está entregando clientes para seus concorrentes. A Galaxy IT & Marketing oferece soluções de SEO local e marketing digital projetadas especificamente para empresas de serviços em ${city.name}, ${getStateFull(city)} — com resultados mensuráveis em 90 dias ou menos.`,
      `Para empreiteiros e empresas de serviços residenciais em ${city.name}, ${getStateAbbr(city)}, marketing digital eficaz não é opcional — é essencial. A Galaxy IT & Marketing combina experiência em SEO local, gestão de mídias sociais e publicidade direcionada para ajudar empresas de ${city.name} a atrair mais clientes e aumentar sua receita.`,
    ],
    'it-support': [
      `Administrar um negócio em ${city.name}, ${getStateAbbr(city)} significa que você precisa de tecnologia que trabalhe tão duro quanto você. A Galaxy IT & Marketing oferece suporte de TI confiável, instalação de câmeras de segurança, desenvolvimento web e soluções tecnológicas para empresas de serviços residenciais em ${city.name} e arredores.`,
      `${city.name} é ${city.desc}, e sua crescente comunidade empresarial precisa de parceiros tecnológicos confiáveis. A Galaxy IT & Marketing oferece suporte de TI no mesmo dia, sistemas de segurança profissionais, sites modernos e pacotes de branding completos para empreiteiros, faxineiros e profissionais de serviços em ${city.name}, ${getStateFull(city)}.`,
      `Problemas tecnológicos custam às empresas de ${city.name} tempo e dinheiro todos os dias. A Galaxy IT & Marketing oferece suporte de TI rápido e acessível e soluções tecnológicas projetadas para empresas de serviços residenciais em ${city.name}, ${getStateAbbr(city)} — de configuração de rede e câmeras de segurança a desenvolvimento web e identidade de marca.`,
      `Para empresas de serviços residenciais em ${city.name}, ${getStateFull(city)}, ter a infraestrutura tecnológica certa é a diferença entre estagnar e escalar. A Galaxy IT & Marketing oferece suporte de TI abrangente, instalações de segurança, desenvolvimento web e branding para empreiteiros e empresas de serviços em ${city.name}.`,
      `Pequenas empresas em ${city.name}, ${getStateAbbr(city)} precisam de um parceiro tecnológico que entenda sua indústria. A Galaxy IT & Marketing oferece suporte de TI prático, sistemas de câmeras de segurança profissionais, sites de alto desempenho e soluções de branding completas para empresas de serviços residenciais em ${city.name} e além.`,
    ],
  };
  return intros[svcKey][h];
}

// ─── TRANSLATED FAQ ──────────────────────────────────────────────────────────
function getFAQsES(svcKey, city) {
  const svc = services[svcKey];
  const svcName = serviceShortNames[svcKey].es.toLowerCase();
  return [
    {
      q: `¿Cuánto cuesta ${svcName} en ${city.name}, ${getStateAbbr(city)}?`,
      a: `Nuestros servicios de ${svcName} para empresas de ${city.name} comienzan con tarifas competitivas adaptadas a pequeñas y medianas empresas. Ofrecemos evaluaciones gratuitas y cotizaciones personalizadas según tus necesidades, tamaño del negocio y objetivos. La mayoría de las empresas de servicios del hogar en ${city.name} invierten entre $500 y $2,500 por mes según el alcance. Contáctanos para una evaluación gratuita y sin compromiso.`,
    },
    {
      q: `¿Cuál es el mejor proveedor de ${svcName} en ${city.name}?`,
      a: `Galaxy IT & Marketing es el proveedor mejor calificado de ${svcName} sirviendo a ${city.name}, ${getStateFull(city)}. Con más de 19 años de experiencia, calificación de 4.9 estrellas y profunda experiencia en empresas de servicios del hogar como construcción, pintura, limpieza y paisajismo, entregamos resultados medibles para empresas del área de ${city.name}. Nuestro equipo bilingüe atiende a empresarios que hablan inglés, español y portugués.`,
    },
    {
      q: `¿Atienden a empresas en el área de ${city.name}?`,
      a: `Sí. Galaxy IT & Marketing atiende con orgullo a empresas en ${city.name}, ${getStateAbbr(city)} y todas las comunidades cercanas. Estamos ubicados en Worcester y ofrecemos servicios presenciales y remotos en todo ${getStateFull(city)} y Nueva Inglaterra. Ya sea que necesites consultas en persona o soporte remoto, cubrimos toda el área de ${city.name}.`,
    },
    {
      q: `¿Qué tan rápido puedo ver resultados de ${svcName} en ${city.name}?`,
      a: svcKey === 'crm-automation'
        ? `La mayoría de las empresas de ${city.name} ven mejoras medibles dentro de 2 a 4 semanas después de la implementación del CRM. Los tiempos de respuesta a leads bajan drásticamente, las tasas de seguimiento aumentan, y nuestros clientes generalmente reportan un aumento del 40% en conversiones en los primeros 90 días.`
        : svcKey === 'seo-marketing'
        ? `Los resultados de SEO para empresas de ${city.name} generalmente comienzan a mostrarse entre 30 y 60 días, con mejoras significativas en rankings hacia el día 90. Las campañas de publicidad pagada generan leads en la primera semana. Nuestros clientes de ${city.name} promedian un aumento del 200% en tráfico web en 6 meses.`
        : `El soporte IT está disponible el mismo día para empresas de ${city.name}. Las instalaciones de cámaras de seguridad se completan típicamente en 1 a 3 días hábiles. Los proyectos de desarrollo web toman de 2 a 4 semanas según la complejidad. Priorizamos tiempos de entrega rápidos para que tu negocio en ${city.name} se mantenga productivo.`,
    },
    {
      q: `¿Por qué debería una empresa de servicios del hogar en ${city.name} invertir en ${svcName}?`,
      a: svcKey === 'crm-automation'
        ? `Las empresas de servicios del hogar en ${city.name} que usan sistemas CRM cierran 30-40% más leads que aquellas que dependen de hojas de cálculo o la memoria. Un CRM organiza tus contactos, automatiza seguimientos y asegura que ningún lead se pierda — algo crítico en el competitivo mercado de contratistas de ${city.name}.`
        : svcKey === 'seo-marketing'
        ? `El 97% de los consumidores buscan en línea antes de contratar un proveedor de servicios local. Si tu empresa en ${city.name} no es visible en Google, estás perdiendo clientes ante competidores que sí lo son. El SEO profesional y el marketing digital ponen tu negocio frente a propietarios que buscan activamente tus servicios en ${city.name}.`
        : `Las fallas tecnológicas cuestan a las pequeñas empresas un promedio de $8,000 por incidente. Para empresas de servicios del hogar en ${city.name}, soporte IT confiable, un sitio web profesional y seguridad adecuada protegen tu reputación y mantienen tus proyectos en marcha. Invertir en soluciones tecnológicas se paga por sí solo rápidamente.`,
    },
  ];
}

function getFAQsPT(svcKey, city) {
  const svc = services[svcKey];
  const svcName = serviceShortNames[svcKey].pt.toLowerCase();
  return [
    {
      q: `Quanto custa ${svcName} em ${city.name}, ${getStateAbbr(city)}?`,
      a: `Nossos serviços de ${svcName} para empresas de ${city.name} começam com tarifas competitivas adaptadas a pequenas e médias empresas. Oferecemos avaliações gratuitas e orçamentos personalizados com base nas suas necessidades, tamanho do negócio e objetivos. A maioria das empresas de serviços residenciais em ${city.name} investe entre $500 e $2.500 por mês dependendo do escopo. Entre em contato para uma avaliação gratuita e sem compromisso.`,
    },
    {
      q: `Qual é o melhor provedor de ${svcName} em ${city.name}?`,
      a: `A Galaxy IT & Marketing é o provedor mais bem avaliado de ${svcName} atendendo ${city.name}, ${getStateFull(city)}. Com mais de 19 anos de experiência, avaliação de 4,9 estrelas e profunda expertise em empresas de serviços residenciais como construção, pintura, limpeza e paisagismo, entregamos resultados mensuráveis para empresas da área de ${city.name}. Nossa equipe bilíngue atende empresários que falam inglês, espanhol e português.`,
    },
    {
      q: `Vocês atendem empresas na área de ${city.name}?`,
      a: `Sim. A Galaxy IT & Marketing atende com orgulho empresas em ${city.name}, ${getStateAbbr(city)} e todas as comunidades vizinhas. Estamos sediados em Worcester e oferecemos serviços presenciais e remotos em todo ${getStateFull(city)} e Nova Inglaterra. Seja para consultas presenciais ou suporte remoto, cobrimos toda a área de ${city.name}.`,
    },
    {
      q: `Quão rápido posso ver resultados de ${svcName} em ${city.name}?`,
      a: svcKey === 'crm-automation'
        ? `A maioria das empresas de ${city.name} vê melhorias mensuráveis dentro de 2 a 4 semanas após a implementação do CRM. Os tempos de resposta a leads caem drasticamente, as taxas de acompanhamento aumentam, e nossos clientes geralmente reportam um aumento de 40% nas conversões nos primeiros 90 dias.`
        : svcKey === 'seo-marketing'
        ? `Os resultados de SEO para empresas de ${city.name} geralmente começam a aparecer entre 30 e 60 dias, com melhorias significativas nos rankings por volta do 90o dia. Campanhas de publicidade paga geram leads na primeira semana. Nossos clientes de ${city.name} têm em média um aumento de 200% no tráfego do site em 6 meses.`
        : `O suporte de TI está disponível no mesmo dia para empresas de ${city.name}. As instalações de câmeras de segurança são concluídas tipicamente em 1 a 3 dias úteis. Projetos de desenvolvimento web levam de 2 a 4 semanas dependendo da complexidade. Priorizamos prazos rápidos para que seu negócio em ${city.name} continue produtivo.`,
    },
    {
      q: `Por que uma empresa de serviços residenciais em ${city.name} deveria investir em ${svcName}?`,
      a: svcKey === 'crm-automation'
        ? `Empresas de serviços residenciais em ${city.name} que usam sistemas CRM fecham 30-40% mais leads do que aquelas que dependem de planilhas ou memória. Um CRM organiza seus contatos, automatiza acompanhamentos e garante que nenhum lead se perca — algo crítico no competitivo mercado de empreiteiros de ${city.name}.`
        : svcKey === 'seo-marketing'
        ? `97% dos consumidores pesquisam online antes de contratar um prestador de serviços local. Se sua empresa em ${city.name} não é visível no Google, você está perdendo clientes para concorrentes que são. SEO profissional e marketing digital colocam seu negócio na frente de proprietários que procuram ativamente seus serviços em ${city.name}.`
        : `Falhas tecnológicas custam às pequenas empresas uma média de $8.000 por incidente. Para empresas de serviços residenciais em ${city.name}, suporte de TI confiável, um site profissional e segurança adequada protegem sua reputação e mantêm seus projetos nos trilhos. Investir em soluções tecnológicas se paga rapidamente.`,
    },
  ];
}

// ─── TRANSLATED FEATURE DESCRIPTIONS ─────────────────────────────────────────
const featureTranslations = {
  'crm-automation': {
    es: [
      { title: 'Configuración y Personalización de CRM', desc: 'Centraliza todos los datos de clientes, rastrea leads y gestiona tu pipeline de ventas en un solo lugar.' },
      { title: 'Automatización de Embudos de Venta', desc: 'Construye embudos de alta conversión que capturan, nutren y cierran leads en piloto automático.' },
      { title: 'Dashboards de Rendimiento', desc: 'Análisis e informes en tiempo real para que siempre sepas qué está funcionando.' },
      { title: 'Automatización de Flujos de Trabajo', desc: 'Elimina tareas repetitivas con automatizaciones inteligentes que ahorran más de 15 horas por semana.' },
      { title: 'Seguimientos Automatizados', desc: 'Nunca pierdas un lead con secuencias de email, SMS y WhatsApp.' },
      { title: 'Programación de Citas', desc: 'Permite a los clientes reservar en línea, reduciendo llamadas perdidas y no-shows.' },
    ],
    pt: [
      { title: 'Configuração e Personalização de CRM', desc: 'Centralize todos os dados de clientes, rastreie leads e gerencie seu pipeline de vendas em um só lugar.' },
      { title: 'Automação de Funis de Venda', desc: 'Construa funis de alta conversão que capturam, nutrem e fecham leads no piloto automático.' },
      { title: 'Dashboards de Desempenho', desc: 'Análises e relatórios em tempo real para que você sempre saiba o que está funcionando.' },
      { title: 'Automação de Fluxos de Trabalho', desc: 'Elimine tarefas repetitivas com automações inteligentes que economizam mais de 15 horas por semana.' },
      { title: 'Acompanhamentos Automatizados', desc: 'Nunca perca um lead com sequências de email, SMS e WhatsApp.' },
      { title: 'Agendamento de Compromissos', desc: 'Permita que clientes reservem online, reduzindo ligações perdidas e faltas.' },
    ],
  },
  'seo-marketing': {
    es: [
      { title: 'SEO Local y Google Business', desc: 'Domina los resultados de búsqueda local y aparece en el top 3 del mapa de Google.' },
      { title: 'Gestión de Redes Sociales', desc: 'Creación de contenido, gestión de comunidad y publicidad social pagada.' },
      { title: 'Campañas de Email, SMS y WhatsApp', desc: 'Alcance multicanal que convierte leads en clientes.' },
      { title: 'Google y Facebook Ads', desc: 'Campañas de publicidad pagada dirigidas con ROI medible.' },
      { title: 'EDDM y Correo Directo', desc: 'Postales y correos dirigidos por vecindario que captan la atención.' },
      { title: 'Marketing de Contenido', desc: 'Blog posts, videos e infografías que construyen autoridad y atraen tráfico orgánico.' },
    ],
    pt: [
      { title: 'SEO Local e Google Meu Negócio', desc: 'Domine os resultados de busca local e apareça no top 3 do mapa do Google.' },
      { title: 'Gestão de Mídias Sociais', desc: 'Criação de conteúdo, gestão de comunidade e publicidade social paga.' },
      { title: 'Campanhas de Email, SMS e WhatsApp', desc: 'Alcance multicanal que converte leads em clientes.' },
      { title: 'Google e Facebook Ads', desc: 'Campanhas de publicidade paga direcionadas com ROI mensurável.' },
      { title: 'EDDM e Mala Direta', desc: 'Postais e correspondências direcionados por bairro que chamam atenção.' },
      { title: 'Marketing de Conteúdo', desc: 'Posts de blog, vídeos e infográficos que constroem autoridade e atraem tráfego orgânico.' },
    ],
  },
  'it-support': {
    es: [
      { title: 'Soporte IT y Resolución de Problemas', desc: 'Soporte técnico rápido y confiable cuando lo necesitas — respuesta garantizada el mismo día.' },
      { title: 'Sistemas de Cámaras de Seguridad', desc: 'Instalación profesional de vigilancia para hogares y negocios.' },
      { title: 'Desarrollo de Sitios Web', desc: 'Sitios web rápidos, modernos y adaptados a móviles optimizados para conversiones.' },
      { title: 'Branding e Identidad', desc: 'Logos, tarjetas de presentación, rotulación de vehículos y paquetes de marca completos.' },
      { title: 'Configuración y Mantenimiento de Red', desc: 'Soluciones de red cableada e inalámbrica para conectividad confiable.' },
      { title: 'Soluciones Cloud y Backup', desc: 'Migración segura a la nube, respaldo de datos y planificación de recuperación ante desastres.' },
    ],
    pt: [
      { title: 'Suporte de TI e Resolução de Problemas', desc: 'Suporte técnico rápido e confiável quando você precisa — resposta garantida no mesmo dia.' },
      { title: 'Sistemas de Câmeras de Segurança', desc: 'Instalação profissional de vigilância para residências e empresas.' },
      { title: 'Desenvolvimento de Sites', desc: 'Sites rápidos, modernos e responsivos otimizados para conversões.' },
      { title: 'Branding e Identidade', desc: 'Logos, cartões de visita, envelopamento de veículos e pacotes de marca completos.' },
      { title: 'Configuração e Manutenção de Rede', desc: 'Soluções de rede cabeada e sem fio para conectividade confiável.' },
      { title: 'Soluções Cloud e Backup', desc: 'Migração segura para nuvem, backup de dados e planejamento de recuperação de desastres.' },
    ],
  },
};

// ─── TRANSLATED STATS ────────────────────────────────────────────────────────
const statsTranslations = {
  'crm-automation': {
    es: ['40% de aumento promedio en conversiones de leads', '15+ horas ahorradas por semana', '3x ROI promedio en 6 meses'],
    pt: ['40% de aumento médio em conversões de leads', '15+ horas economizadas por semana', '3x ROI médio em 6 meses'],
  },
  'seo-marketing': {
    es: ['Top 3 en Google en 90 días', '200% de aumento promedio en tráfico web', '5x más leads entrantes'],
    pt: ['Top 3 no Google em 90 dias', '200% de aumento médio no tráfego do site', '5x mais leads recebidos'],
  },
  'it-support': {
    es: ['Respuesta de soporte el mismo día', 'Instalaciones de seguridad de nivel profesional', 'Paquetes completos de identidad de marca'],
    pt: ['Resposta de suporte no mesmo dia', 'Instalações de segurança profissional', 'Pacotes completos de identidade de marca'],
  },
};

// ─── TRANSLATED PROCESS STEPS ────────────────────────────────────────────────
const processTranslations = {
  'crm-automation': {
    es: [
      { title: 'Auditoría y Estrategia', desc: 'Analizamos tu proceso de ventas actual, identificamos cuellos de botella y diseñamos un plan CRM personalizado.' },
      { title: 'Construir e Integrar', desc: 'Configuramos tu CRM, importamos contactos, creamos automatizaciones y conectamos tus herramientas.' },
      { title: 'Lanzar y Optimizar', desc: 'Entrenamos a tu equipo, lanzamos en vivo y optimizamos continuamente para mejores resultados.' },
    ],
    pt: [
      { title: 'Auditoria e Estratégia', desc: 'Analisamos seu processo de vendas atual, identificamos gargalos e projetamos um plano CRM personalizado.' },
      { title: 'Construir e Integrar', desc: 'Configuramos seu CRM, importamos contatos, criamos automações e conectamos suas ferramentas.' },
      { title: 'Lançar e Otimizar', desc: 'Treinamos sua equipe, lançamos ao vivo e otimizamos continuamente para melhores resultados.' },
    ],
  },
  'seo-marketing': {
    es: [
      { title: 'Investigación y Auditoría', desc: 'Auditamos tu presencia online, investigamos competidores e identificamos oportunidades de palabras clave.' },
      { title: 'Estrategia y Ejecución', desc: 'Implementamos SEO on-page, creamos contenido, lanzamos campañas y optimizamos tus perfiles.' },
      { title: 'Reportar y Escalar', desc: 'Informes mensuales mostrando resultados reales, con mejoras continuas para maximizar el ROI.' },
    ],
    pt: [
      { title: 'Pesquisa e Auditoria', desc: 'Auditamos sua presença online, pesquisamos concorrentes e identificamos oportunidades de palavras-chave.' },
      { title: 'Estratégia e Execução', desc: 'Implementamos SEO on-page, criamos conteúdo, lançamos campanhas e otimizamos seus perfis.' },
      { title: 'Reportar e Escalar', desc: 'Relatórios mensais mostrando resultados reais, com melhorias contínuas para maximizar o ROI.' },
    ],
  },
  'it-support': {
    es: [
      { title: 'Consultar y Evaluar', desc: 'Evaluamos tus necesidades tecnológicas, preocupaciones de seguridad y objetivos de crecimiento.' },
      { title: 'Implementar e Instalar', desc: 'Desplegamos soluciones, instalamos equipos y configuramos todo para máximo rendimiento.' },
      { title: 'Soporte y Mantenimiento', desc: 'Mantenimiento continuo, monitoreo y soporte para mantener tu negocio funcionando sin problemas.' },
    ],
    pt: [
      { title: 'Consultar e Avaliar', desc: 'Avaliamos suas necessidades tecnológicas, preocupações de segurança e objetivos de crescimento.' },
      { title: 'Implementar e Instalar', desc: 'Implantamos soluções, instalamos equipamentos e configuramos tudo para máximo desempenho.' },
      { title: 'Suporte e Manutenção', desc: 'Manutenção contínua, monitoramento e suporte para manter seu negócio funcionando sem problemas.' },
    ],
  },
};

// ─── HTML GENERATOR ───────────────────────────────────────────────────────────
function generatePage(city, svcKey) {
  const svc = services[svcKey];
  const citySlug = slugify(city.name);
  const stateAbbr = getStateAbbr(city);
  const stateFull = getStateFull(city);
  const stateSlug = getStateSlug(city);
  const canonicalPath = `${svcKey}-${citySlug}-${stateSlug}`;
  const canonicalUrl = `https://galaxyinfo.us/${canonicalPath}`;
  const pageTitle = `${svc.title} in ${city.name}, ${stateAbbr} | Galaxy IT & Marketing`;
  const metaDesc = `Professional ${svc.title.toLowerCase()} for small businesses in ${city.name}, ${stateFull}. CRM, SEO, IT support for contractors, painters, cleaners & more. Free assessment. Call (508) 499-9279.`;
  const introParagraph = getIntroParagraph(svcKey, city);
  const introParagraphES = getIntroParagraphES(svcKey, city);
  const introParagraphPT = getIntroParagraphPT(svcKey, city);
  const whyChoose = getWhyChooseItems(svcKey, city);
  const faqs = getFAQs(svcKey, city);
  const faqsES = getFAQsES(svcKey, city);
  const faqsPT = getFAQsPT(svcKey, city);
  const nearbyLinks = getNearbyLinks(city, svcKey);
  const otherServices = Object.keys(services).filter(k => k !== svcKey);

  const svcNameEN = serviceNames[svcKey].en;
  const svcNameES = serviceNames[svcKey].es;
  const svcNamePT = serviceNames[svcKey].pt;
  const svcShortEN = serviceShortNames[svcKey].en;
  const svcShortES = serviceShortNames[svcKey].es;
  const svcShortPT = serviceShortNames[svcKey].pt;

  // Feature descriptions per language
  const featEN = svc.features;
  const featES = featureTranslations[svcKey].es;
  const featPT = featureTranslations[svcKey].pt;

  // Stats per language
  const statsEN = svc.stats;
  const statsES = statsTranslations[svcKey].es;
  const statsPT = statsTranslations[svcKey].pt;

  // Process per language
  const procEN = svc.process;
  const procES = processTranslations[svcKey].es;
  const procPT = processTranslations[svcKey].pt;

  // Why-choose extra items translated
  const whyExtraEN = whyChoose.slice(4);
  let whyExtraKeysES = [], whyExtraKeysPT = [];
  if (svcKey === 'crm-automation') {
    whyExtraKeysES = [
      { title: 'Sin Contratos a Largo Plazo', desc: 'Servicio mes a mes. Nos ganamos tu confianza cada mes.' },
      { title: 'Capacitación Completa Incluida', desc: 'No solo configuramos tu CRM — entrenamos a todo tu equipo para usarlo eficazmente.' },
    ];
    whyExtraKeysPT = [
      { title: 'Sem Contratos de Longo Prazo', desc: 'Serviço mês a mês. Conquistamos sua confiança todo mês.' },
      { title: 'Treinamento Completo Incluído', desc: 'Não apenas configuramos seu CRM — treinamos toda sua equipe para usá-lo com eficiência.' },
    ];
  } else if (svcKey === 'seo-marketing') {
    whyExtraKeysES = [
      { title: 'Reportes Transparentes', desc: 'Informes mensuales con métricas reales — rankings, tráfico, leads y ROI. Sin números de vanidad.' },
      { title: 'Resultados en 90 Días', desc: 'Nuestros clientes generalmente ven rankings en la primera página de Google en 90 días.' },
    ];
    whyExtraKeysPT = [
      { title: 'Relatórios Transparentes', desc: 'Relatórios mensais com métricas reais — rankings, tráfego, leads e ROI. Sem números de vaidade.' },
      { title: 'Resultados em 90 Dias', desc: 'Nossos clientes geralmente veem rankings na primeira página do Google em 90 dias.' },
    ];
  } else {
    whyExtraKeysES = [
      { title: 'Respuesta el Mismo Día', desc: 'Cuando surgen problemas técnicos, respondemos el mismo día — porque el tiempo inactivo te cuesta dinero.' },
      { title: 'Expertos en Seguridad', desc: 'Sistemas de cámaras de seguridad de grado profesional instalados y monitoreados para tu tranquilidad.' },
    ];
    whyExtraKeysPT = [
      { title: 'Resposta no Mesmo Dia', desc: 'Quando problemas técnicos surgem, respondemos no mesmo dia — porque tempo parado custa dinheiro.' },
      { title: 'Especialistas em Segurança', desc: 'Sistemas de câmeras de segurança profissionais instalados e monitorados para sua tranquilidade.' },
    ];
  }

  // Build the _cityTranslations object for this page
  const cityTransEN = {
    city_hero_badge: `Serving ${city.name}, ${getStateAbbr(city)}`,
    city_hero_h1: `${svcNameEN} in`,
    city_hero_h1_gold: `${city.name}, ${getStateFull(city)}`,
    city_hero_subtitle: introParagraph,
    city_why_h2: `Why ${city.name} Businesses Choose Galaxy IT & Marketing`,
    city_why_p: `${city.name} is ${city.desc}. Local businesses here need a technology and marketing partner who understands their market, speaks their language, and delivers real results.`,
    city_features_h2: `${svcNameEN} for ${city.name} Businesses`,
    city_features_p: `Everything your ${city.name} business needs to ${svcKey === 'crm-automation' ? 'organize leads, automate sales, and close more deals' : svcKey === 'seo-marketing' ? 'get found online, attract more customers, and grow revenue' : 'stay connected, protected, and professionally branded'}.`,
    city_features_label_text: `${svc.shortTitle}`,
    city_industries_h2_city: `Home-Service Businesses We Help in ${city.name}`,
    city_industries_p_city: `We specialize in helping contractors, tradespeople, and service professionals throughout ${city.name}, ${getStateAbbr(city)} grow their businesses with smart technology and proven marketing.`,
    city_process_h2_city: `3 Simple Steps to Get Started`,
    city_process_p_city: `Getting ${svc.shortTitle.toLowerCase()} for your ${city.name} business is easy. Here's how we work together.`,
    city_testimonials_h2_city: `What Business Owners Say About Galaxy IT`,
    city_faq_h2: `${svcNameEN} in ${city.name} — Frequently Asked Questions`,
    city_cta_h2_city: `Ready to Grow Your ${city.name} Business?`,
    city_cta_p: `Get a free, no-obligation growth assessment from Galaxy IT & Marketing. We'll analyze your business and recommend the perfect strategy — completely free.`,
    city_nearby_h3_city: `${svcNameEN} in Other Massachusetts Cities`,
    city_nearby_p: `We also serve businesses in these nearby communities:`,
    city_breadcrumb_current: `${svc.title} in ${city.name}`,
  };

  const cityTransES = {
    city_hero_badge: `Sirviendo ${city.name}, ${getStateAbbr(city)}`,
    city_hero_h1: `${svcNameES} en`,
    city_hero_h1_gold: `${city.name}, ${getStateFull(city)}`,
    city_hero_subtitle: introParagraphES,
    city_why_h2: `Por Qué las Empresas de ${city.name} Eligen Galaxy IT & Marketing`,
    city_why_p: `${city.name} es ${city.desc}. Las empresas locales aquí necesitan un socio de tecnología y marketing que entienda su mercado, hable su idioma y entregue resultados reales.`,
    city_features_h2: `${svcNameES} para Empresas de ${city.name}`,
    city_features_p: `Todo lo que tu empresa de ${city.name} necesita para ${svcKey === 'crm-automation' ? 'organizar leads, automatizar ventas y cerrar más negocios' : svcKey === 'seo-marketing' ? 'ser encontrada en línea, atraer más clientes y aumentar ingresos' : 'estar conectada, protegida y con marca profesional'}.`,
    city_features_label_text: `${svcShortES}`,
    city_industries_h2_city: `Empresas de Servicios del Hogar que Ayudamos en ${city.name}`,
    city_industries_p_city: `Nos especializamos en ayudar a contratistas, profesionales de oficios y proveedores de servicios en ${city.name}, ${getStateAbbr(city)} a hacer crecer sus negocios con tecnología inteligente y marketing comprobado.`,
    city_process_h2_city: `3 Pasos Simples para Comenzar`,
    city_process_p_city: `Obtener ${svcShortES.toLowerCase()} para tu negocio en ${city.name} es fácil. Así es como trabajamos juntos.`,
    city_testimonials_h2_city: `Lo Que Dicen los Empresarios Sobre Galaxy IT`,
    city_faq_h2: `${svcNameES} en ${city.name} — Preguntas Frecuentes`,
    city_cta_h2_city: `¿Listo para Hacer Crecer tu Negocio en ${city.name}?`,
    city_cta_p: `Obtén una evaluación de crecimiento gratuita y sin compromiso de Galaxy IT & Marketing. Analizaremos tu negocio y recomendaremos la estrategia perfecta — completamente gratis.`,
    city_nearby_h3_city: `${svcNameES} en Otras Ciudades de Massachusetts`,
    city_nearby_p: `También atendemos a empresas en estas comunidades cercanas:`,
    city_breadcrumb_current: `${svcNameES} en ${city.name}`,
  };

  const cityTransPT = {
    city_hero_badge: `Atendendo ${city.name}, ${getStateAbbr(city)}`,
    city_hero_h1: `${svcNamePT} em`,
    city_hero_h1_gold: `${city.name}, ${getStateFull(city)}`,
    city_hero_subtitle: introParagraphPT,
    city_why_h2: `Por Que Empresas de ${city.name} Escolhem a Galaxy IT & Marketing`,
    city_why_p: `${city.name} é ${city.desc}. As empresas locais aqui precisam de um parceiro de tecnologia e marketing que entenda seu mercado, fale sua língua e entregue resultados reais.`,
    city_features_h2: `${svcNamePT} para Empresas de ${city.name}`,
    city_features_p: `Tudo que sua empresa de ${city.name} precisa para ${svcKey === 'crm-automation' ? 'organizar leads, automatizar vendas e fechar mais negócios' : svcKey === 'seo-marketing' ? 'ser encontrada online, atrair mais clientes e aumentar receita' : 'ficar conectada, protegida e com marca profissional'}.`,
    city_features_label_text: `${svcShortPT}`,
    city_industries_h2_city: `Empresas de Serviços Residenciais que Ajudamos em ${city.name}`,
    city_industries_p_city: `Somos especialistas em ajudar empreiteiros, profissionais de ofícios e prestadores de serviços em ${city.name}, ${getStateAbbr(city)} a fazer seus negócios crescerem com tecnologia inteligente e marketing comprovado.`,
    city_process_h2_city: `3 Passos Simples para Começar`,
    city_process_p_city: `Obter ${svcShortPT.toLowerCase()} para seu negócio em ${city.name} é fácil. Veja como trabalhamos juntos.`,
    city_testimonials_h2_city: `O Que Empresários Dizem Sobre a Galaxy IT`,
    city_faq_h2: `${svcNamePT} em ${city.name} — Perguntas Frequentes`,
    city_cta_h2_city: `Pronto para Fazer seu Negócio em ${city.name} Crescer?`,
    city_cta_p: `Obtenha uma avaliação de crescimento gratuita e sem compromisso da Galaxy IT & Marketing. Vamos analisar seu negócio e recomendar a estratégia perfeita — completamente grátis.`,
    city_nearby_h3_city: `${svcNamePT} em Outras Cidades de Massachusetts`,
    city_nearby_p: `Também atendemos empresas nestas comunidades próximas:`,
    city_breadcrumb_current: `${svcNamePT} em ${city.name}`,
  };

  // Add why-choose card translations (local + city-specific)
  cityTransEN['city_whychoose_local_title'] = `Local to ${city.name}`;
  cityTransEN['city_whychoose_local_desc'] = `We know the ${city.name} market, its neighborhoods, and what local customers are searching for.`;
  cityTransES['city_whychoose_local_title'] = `Locales en ${city.name}`;
  cityTransES['city_whychoose_local_desc'] = `Conocemos el mercado de ${city.name}, sus vecindarios y lo que los clientes locales buscan.`;
  cityTransPT['city_whychoose_local_title'] = `Locais em ${city.name}`;
  cityTransPT['city_whychoose_local_desc'] = `Conhecemos o mercado de ${city.name}, seus bairros e o que os clientes locais procuram.`;

  // Add extra why-choose cards (index 4,5)
  whyExtraEN.forEach((item, i) => {
    cityTransEN[`city_whychoose_extra${i}_title`] = item.title;
    cityTransEN[`city_whychoose_extra${i}_desc`] = item.desc;
  });
  whyExtraKeysES.forEach((item, i) => {
    cityTransES[`city_whychoose_extra${i}_title`] = item.title;
    cityTransES[`city_whychoose_extra${i}_desc`] = item.desc;
  });
  whyExtraKeysPT.forEach((item, i) => {
    cityTransPT[`city_whychoose_extra${i}_title`] = item.title;
    cityTransPT[`city_whychoose_extra${i}_desc`] = item.desc;
  });

  // Add feature translations
  featEN.forEach((f, i) => {
    cityTransEN[`city_feat${i}_title`] = f.title;
    cityTransEN[`city_feat${i}_desc`] = f.desc;
  });
  featES.forEach((f, i) => {
    cityTransES[`city_feat${i}_title`] = f.title;
    cityTransES[`city_feat${i}_desc`] = f.desc;
  });
  featPT.forEach((f, i) => {
    cityTransPT[`city_feat${i}_title`] = f.title;
    cityTransPT[`city_feat${i}_desc`] = f.desc;
  });

  // Add stat translations
  statsEN.forEach((s, i) => { cityTransEN[`city_stat${i}`] = s.text; });
  statsES.forEach((s, i) => { cityTransES[`city_stat${i}`] = s; });
  statsPT.forEach((s, i) => { cityTransPT[`city_stat${i}`] = s; });

  // Add process step translations
  procEN.forEach((s, i) => {
    cityTransEN[`city_proc${i}_title`] = `Step ${i + 1}: ${s.title}`;
    cityTransEN[`city_proc${i}_desc`] = s.desc;
  });
  procES.forEach((s, i) => {
    cityTransES[`city_proc${i}_title`] = `Paso ${i + 1}: ${s.title}`;
    cityTransES[`city_proc${i}_desc`] = s.desc;
  });
  procPT.forEach((s, i) => {
    cityTransPT[`city_proc${i}_title`] = `Passo ${i + 1}: ${s.title}`;
    cityTransPT[`city_proc${i}_desc`] = s.desc;
  });

  // Add FAQ translations
  faqs.forEach((f, i) => {
    cityTransEN[`city_faq_q${i}`] = f.q;
    cityTransEN[`city_faq_a${i}`] = f.a;
  });
  faqsES.forEach((f, i) => {
    cityTransES[`city_faq_q${i}`] = f.q;
    cityTransES[`city_faq_a${i}`] = f.a;
  });
  faqsPT.forEach((f, i) => {
    cityTransPT[`city_faq_q${i}`] = f.q;
    cityTransPT[`city_faq_a${i}`] = f.a;
  });

  // Add nearby link translations
  nearbyLinks.forEach((l, i) => {
    cityTransEN[`city_nearby_link${i}`] = `${svc.shortTitle} in ${l.name}`;
    cityTransES[`city_nearby_link${i}`] = `${svcShortES} en ${l.name}`;
    cityTransPT[`city_nearby_link${i}`] = `${svcShortPT} em ${l.name}`;
  });
  otherServices.forEach((osKey, i) => {
    const os = services[osKey];
    cityTransEN[`city_also_link${i}`] = `${os.title} in ${city.name}`;
    cityTransES[`city_also_link${i}`] = `${serviceNames[osKey].es} en ${city.name}`;
    cityTransPT[`city_also_link${i}`] = `${serviceNames[osKey].pt} em ${city.name}`;
  });

  const cityTransJSON = JSON.stringify({ en: cityTransEN, es: cityTransES, pt: cityTransPT });

  const faqSchemaItems = faqs.map(f => `{
            "@type": "Question",
            "name": ${JSON.stringify(f.q)},
            "acceptedAnswer": {
              "@type": "Answer",
              "text": ${JSON.stringify(f.a)}
            }
          }`).join(',\n          ');

  const breadcrumbServiceName = svc.title;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <meta name="description" content="${metaDesc}">
    <meta name="keywords" content="${svc.shortTitle.toLowerCase()} ${city.name} MA, ${svc.title.toLowerCase()} ${city.name} Massachusetts, small business ${svc.shortTitle.toLowerCase()} ${city.name}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="Galaxy IT & Marketing">
    <meta name="geo.region" content="US-MA">
    <meta name="geo.placename" content="${city.name}">

    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="https://galaxyinfo.us/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Galaxy IT & Marketing">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="es_ES">
    <meta property="og:locale:alternate" content="pt_BR">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="https://galaxyinfo.us/images/og-image.jpg">

    <!-- Canonical & Hreflang -->
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="en" href="${canonicalUrl}">
    <link rel="alternate" hreflang="es" href="${canonicalUrl}?lang=es">
    <link rel="alternate" hreflang="pt" href="${canonicalUrl}?lang=pt">
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}">

    <!-- Preconnect -->
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    <link rel="preconnect" href="https://flagcdn.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌌</text></svg>">

    <!-- Styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../styles.css">

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://galaxyinfo.us/#organization",
        "name": "Galaxy IT & Marketing",
        "description": "Professional ${svc.title.toLowerCase()} for small businesses in ${city.name}, ${stateAbbr}. 19+ years serving New England.",
        "url": "https://galaxyinfo.us/",
        "telephone": "+1-508-499-9279",
        "email": "info@galaxyinfo.us",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Worcester",
          "addressRegion": "MA",
          "postalCode": "01601",
          "addressCountry": "US"
        },
        "areaServed": {
          "@type": "City",
          "name": "${city.name}",
          "containedInPlace": {
            "@type": "State",
            "name": "${stateFull}"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "47",
          "bestRating": "5"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "${svc.title}",
        "provider": { "@id": "https://galaxyinfo.us/#organization" },
        "areaServed": {
          "@type": "City",
          "name": "${city.name}",
          "containedInPlace": { "@type": "State", "name": "${stateFull}" }
        },
        "description": "Professional ${svc.title.toLowerCase()} services for small businesses and home-service companies in ${city.name}, ${stateAbbr}.",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "areaServed": { "@type": "City", "name": "${city.name}" }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://galaxyinfo.us/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://galaxyinfo.us/services" },
          { "@type": "ListItem", "position": 3, "name": "${breadcrumbServiceName} in ${city.name}", "item": "${canonicalUrl}" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          ${faqSchemaItems}
        ]
      }
    ]
    </script>

    <!-- City page inline styles -->
    <style>
      .city-hero { padding: 140px 0 80px; background: var(--gradient-hero); color: var(--neutral-white); position: relative; overflow: hidden; }
      .city-hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 30% 50%, rgba(255,215,0,0.08) 0%, transparent 60%); pointer-events: none; }
      .city-hero .container { position: relative; z-index: 2; }
      .city-hero h1 { font-size: clamp(2rem, 5vw, 3.2rem); margin-bottom: 20px; line-height: 1.15; }
      .city-hero h1 span.gold { background: var(--gradient-gold); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .city-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
      .city-hero-info { padding-top: 20px; }
      .city-hero-info .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.3); padding: 8px 18px; border-radius: 50px; font-size: 0.85rem; color: var(--accent-gold); margin-bottom: 20px; }
      .city-hero-info p.subtitle { font-size: 1.15rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 28px; }
      .hero-trust-row { display: flex; align-items: center; gap: 16px; margin-top: 24px; }
      .hero-trust-avatars { display: flex; }
      .hero-trust-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gradient-gold); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; color: var(--primary-dark); margin-left: -8px; border: 2px solid var(--primary-dark); }
      .hero-trust-avatar:first-child { margin-left: 0; }
      .hero-trust-text { color: rgba(255,255,255,0.6); font-size: 0.85rem; }

      .city-inline-form { background: #fff; border: 1px solid #e0e0e0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
      .city-inline-form h3 { color: #0d1b2a; font-size: 1.3rem; margin-bottom: 6px; }
      .city-inline-form p { color: #6b7280; font-size: 0.9rem; margin-bottom: 20px; }
      .city-inline-form .form-group { margin-bottom: 14px; }
      .city-inline-form label { display: block; color: #0d1b2a; font-size: 0.85rem; margin-bottom: 4px; font-weight: 600; }
      .city-inline-form input, .city-inline-form select { width: 100%; padding: 10px 14px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.08); background: #f8f9fa; color: #333; font-size: 0.95rem; transition: border-color 0.2s; }
      .city-inline-form input:focus, .city-inline-form select:focus { border-color: #1a237e; outline: none; background: #fff; color: #333; }
      .city-inline-form input::placeholder { color: #999; }
      .city-inline-form select option { background: #fff; color: #333; }
      .city-inline-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .city-inline-form .form-security { text-align: center; margin-top: 10px; font-size: 0.78rem; color: #999; }
      .city-inline-form .form-success { display: none; text-align: center; padding: 30px 0; }
      .city-inline-form .form-success.active { display: block; }
      .city-inline-form .form-success i { font-size: 3rem; color: var(--secondary-green); margin-bottom: 12px; }
      .city-inline-form .form-success h3 { color: #0d1b2a; }
      .city-inline-form .form-success p { color: #6b7280; }

      .section-why { padding: 80px 0; }
      .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 40px; }
      .why-card { background: var(--neutral-white); border-radius: 12px; padding: 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform 0.3s, box-shadow 0.3s; }
      .why-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
      .why-card i { font-size: 2rem; color: var(--accent-gold); margin-bottom: 16px; }
      .why-card h3 { font-size: 1.1rem; margin-bottom: 8px; color: var(--primary-dark); }
      .why-card p { color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; }

      .section-features { padding: 80px 0; background: var(--bg-light); }
      .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; margin-top: 40px; }
      .feature-card { background: var(--neutral-white); border-radius: 12px; padding: 28px; display: flex; gap: 18px; align-items: flex-start; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: transform 0.3s; }
      .feature-card:hover { transform: translateY(-3px); }
      .feature-card .feature-icon { width: 48px; height: 48px; border-radius: 10px; background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .feature-card .feature-icon i { font-size: 1.2rem; color: var(--accent-gold-dark); }
      .feature-card h3 { font-size: 1rem; margin-bottom: 6px; color: var(--primary-dark); }
      .feature-card p { color: var(--text-muted); font-size: 0.88rem; line-height: 1.55; }

      .section-industries { padding: 80px 0; }
      .industries-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 40px; }
      .industry-item { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: var(--neutral-white); border-radius: 10px; box-shadow: 0 1px 6px rgba(0,0,0,0.05); }
      .industry-item i { font-size: 1.3rem; color: var(--secondary-green); }
      .industry-item div h4 { font-size: 0.95rem; color: var(--primary-dark); margin-bottom: 2px; }
      .industry-item div p { font-size: 0.8rem; color: var(--text-muted); margin: 0; }

      .section-process { padding: 80px 0; background: var(--gradient-hero); color: var(--neutral-white); }
      .process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 40px; }
      .process-step { text-align: center; position: relative; }
      .process-step .step-number { width: 60px; height: 60px; border-radius: 50%; background: var(--gradient-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
      .process-step .step-number i { font-size: 1.4rem; color: var(--primary-dark); }
      .process-step h3 { font-size: 1.15rem; margin-bottom: 10px; }
      .process-step p { color: rgba(255,255,255,0.75); font-size: 0.92rem; line-height: 1.6; }

      .section-testimonials { padding: 80px 0; background: var(--bg-light); }
      .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 40px; }
      .testimonial-card { background: var(--neutral-white); border-radius: 12px; padding: 28px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
      .testimonial-card .stars { color: var(--accent-gold); margin-bottom: 12px; font-size: 0.9rem; }
      .testimonial-card blockquote { color: var(--text-body); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px; font-style: italic; }
      .testimonial-card .author { font-weight: 600; color: var(--primary-dark); font-size: 0.9rem; }
      .testimonial-card .author span { font-weight: 400; color: var(--text-muted); }

      .section-faq { padding: 80px 0; }
      .faq-list { max-width: 800px; margin: 40px auto 0; }
      .faq-item { border-bottom: 1px solid var(--border-light, #e5e7eb); padding: 24px 0; }
      .faq-item h3 { font-size: 1.05rem; color: var(--primary-dark); margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
      .faq-item h3 i { font-size: 0.8rem; color: var(--text-muted); transition: transform 0.3s; }
      .faq-item p { color: var(--text-body); font-size: 0.92rem; line-height: 1.7; }

      .section-nearby { padding: 60px 0; background: var(--bg-light); }
      .nearby-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; justify-content: center; }
      .nearby-links a { display: inline-block; padding: 8px 18px; background: var(--neutral-white); border: 1px solid var(--border-light, #e5e7eb); border-radius: 8px; color: var(--primary-dark); font-size: 0.9rem; text-decoration: none; transition: all 0.2s; }
      .nearby-links a:hover { border-color: var(--accent-gold); color: var(--accent-gold-dark); transform: translateY(-2px); }

      @media (max-width: 768px) {
        .city-hero-grid { grid-template-columns: 1fr; gap: 40px; }
        .process-grid { grid-template-columns: 1fr; gap: 30px; }
        .city-inline-form .form-row { grid-template-columns: 1fr; }
      }
    </style>
</head>
<body>

    <!-- HEADER -->
    <header class="header" id="header">
        <div class="container">
            <a href="/" class="logo" aria-label="Galaxy IT & Marketing Home">
                <div class="logo-icon"><img src="../images/logo-white.svg" alt="Galaxy IT Logo"></div>
                <div class="logo-text">Galaxy <span>IT</span></div>
            </a>
            <nav>
                <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
                <div class="nav-links" id="navLinks">
                    <a href="/" data-i18n="nav_home">Home</a>
                    <a href="/services" data-i18n="nav_services">Services</a>
                    <a href="/about" data-i18n="nav_about">About</a>
                    <a href="/contact" data-i18n="nav_contact">Contact</a>
                    <a href="/areas" data-i18n="nav_areas">Service Areas</a>
                    <a href="/consultation" class="nav-cta" data-i18n="nav_cta">Free Assessment</a>
                </div>
            </nav>
            <div class="lang-switcher">
                <button class="lang-btn active" data-lang="en" title="English" aria-label="English"><img src="https://flagcdn.com/w40/us.png" alt="EN" width="20" height="15"></button>
                <button class="lang-btn" data-lang="es" title="Espa&ntilde;ol" aria-label="Espa&ntilde;ol"><img src="https://flagcdn.com/w40/es.png" alt="ES" width="20" height="15"></button>
                <button class="lang-btn" data-lang="pt" title="Portugu&ecirc;s" aria-label="Portugu&ecirc;s"><img src="https://flagcdn.com/w40/br.png" alt="PT" width="20" height="15"></button>
            </div>
        </div>
    </header>

    <!-- HERO -->
    <section class="city-hero">
        <div class="container">
            <div class="city-hero-grid">
                <div class="city-hero-info fade-up">
                    <div class="hero-badge">
                        <i class="fas fa-map-marker-alt"></i>
                        <span data-i18n="city_hero_badge">Serving ${city.name}, ${stateAbbr}</span>
                    </div>
                    <h1><span data-i18n="city_hero_h1">${svc.title} in</span> <span class="gold" data-i18n="city_hero_h1_gold">${city.name}, ${stateFull}</span></h1>
                    <p class="subtitle" data-i18n="city_hero_subtitle">${introParagraph}</p>
                    <div class="hero-trust-row">
                        <div class="hero-trust-avatars">
                            <div class="hero-trust-avatar">JB</div>
                            <div class="hero-trust-avatar">MK</div>
                            <div class="hero-trust-avatar">RA</div>
                        </div>
                        <span class="hero-trust-text" data-i18n="city_trust_text">Join 100+ businesses that trust Galaxy IT</span>
                    </div>
                </div>
                <div class="city-inline-form fade-up" id="cityFormWrap">
                    <h3><i class="${svc.icon}"></i> <span data-i18n="city_form_h3">Get Your Free Assessment</span></h3>
                    <p data-i18n="city_form_p">Fill out the form and we'll reach out within 24 hours.</p>
                    <form id="cityConsultForm" novalidate>
                        <input type="hidden" name="service" value="${svcKey}">
                        <input type="hidden" name="city" value="${city.name}, ${stateAbbr}">
                        <input type="hidden" name="source" value="city-page-${canonicalPath}">
                        <div class="form-group">
                            <label for="cfName" data-i18n="consult_label_name">Full Name *</label>
                            <input type="text" id="cfName" name="name" placeholder="John Doe" required>
                            <span class="error-message">Please enter your name</span>
                        </div>
                        <div class="form-group">
                            <label for="cfEmail" data-i18n="consult_label_email">Email Address *</label>
                            <input type="email" id="cfEmail" name="email" placeholder="john@company.com" required>
                            <span class="error-message">Please enter a valid email address</span>
                        </div>
                        <div class="form-group">
                            <label for="cfPhone" data-i18n="consult_label_phone">Phone Number *</label>
                            <input type="tel" id="cfPhone" name="phone" placeholder="(555) 123-4567" required>
                            <span class="error-message">Please enter your phone number</span>
                        </div>
                        <div class="form-group">
                            <label for="cfBusiness" data-i18n="consult_label_business">Business Name</label>
                            <input type="text" id="cfBusiness" name="business" placeholder="Your Business Name">
                        </div>
                        <div class="form-group">
                            <label for="cfIndustry" data-i18n="consult_label_industry">Industry</label>
                            <select id="cfIndustry" name="industry">
                                <option value="" data-i18n="consult_ind_default">Select your industry...</option>
                                <option value="construction" data-i18n="consult_ind_construction">Construction</option>
                                <option value="painting" data-i18n="consult_ind_painting">Painting</option>
                                <option value="cleaning" data-i18n="consult_ind_cleaning">Cleaning Services</option>
                                <option value="roofing" data-i18n="consult_ind_roofing">Roofing / Siding</option>
                                <option value="landscaping" data-i18n="consult_ind_landscaping">Landscaping</option>
                                <option value="carpentry" data-i18n="consult_ind_carpentry">Carpentry</option>
                                <option value="electrical" data-i18n="consult_ind_electrical">Electrical</option>
                                <option value="plumbing" data-i18n="consult_ind_plumbing">Plumbing</option>
                                <option value="other" data-i18n="consult_ind_other">Other Home Service</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cfHelp" data-i18n="consult_label_help">What Do You Need Help With?</label>
                            <select id="cfHelp" name="helpWith">
                                <option value="" data-i18n="consult_help_default">Select...</option>
                                <option value="more-leads" data-i18n="consult_help_leads">Getting More Leads</option>
                                <option value="crm" data-i18n="consult_help_crm">CRM & Automation</option>
                                <option value="seo" data-i18n="consult_help_seo">Local SEO & Google Rankings</option>
                                <option value="social" data-i18n="consult_help_social">Social Media Management</option>
                                <option value="website" data-i18n="consult_help_website">Website Development</option>
                                <option value="branding" data-i18n="consult_help_branding">Branding & Identity</option>
                                <option value="tech" data-i18n="consult_help_tech">IT Support & Security</option>
                                <option value="all" data-i18n="consult_help_all">Complete Growth Package</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cfMessage" data-i18n="consult_label_message">Anything Else? (Optional)</label>
                            <textarea id="cfMessage" name="message" placeholder="Tell us about your goals or challenges..." rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn ${svc.btnClass}" style="width:100%;margin-top:4px;">
                            <i class="fas fa-calendar-check"></i> <span data-i18n="consult_btn">Get My Free Assessment</span>
                        </button>
                        <p class="form-security"><i class="fas fa-lock"></i> <span data-i18n="consult_security">Your information is secure and will never be shared.</span></p>
                    </form>
                    <div class="form-success" id="cityFormSuccess">
                        <i class="fas fa-check-circle"></i>
                        <h3 data-i18n="consult_success_h3">You're All Set!</h3>
                        <p data-i18n="consult_success_p">Thank you for requesting your free growth assessment. One of our specialists will reach out within 24 hours to schedule your call.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- BREADCRUMB -->
    <nav aria-label="Breadcrumb" style="background:var(--bg-light);padding:12px 0;border-bottom:1px solid #e5e7eb;">
        <div class="container">
            <ol style="display:flex;gap:8px;list-style:none;margin:0;padding:0;font-size:0.85rem;color:var(--text-muted);">
                <li><a href="/" style="color:var(--text-muted);text-decoration:none;" data-i18n="city_breadcrumb_home">Home</a></li>
                <li>/</li>
                <li><a href="/services" style="color:var(--text-muted);text-decoration:none;" data-i18n="city_breadcrumb_services">Services</a></li>
                <li>/</li>
                <li style="color:var(--primary-dark);font-weight:500;" data-i18n="city_breadcrumb_current">${svc.title} in ${city.name}</li>
            </ol>
        </div>
    </nav>

    <!-- WHY CHOOSE US -->
    <section class="section-why" id="why">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:20px;">
                <span class="section-label" data-i18n="city_why_label">Why Galaxy IT</span>
                <h2 data-i18n="city_why_h2">Why ${city.name} Businesses Choose Galaxy IT & Marketing</h2>
                <p style="max-width:640px;margin:12px auto 0;color:var(--text-muted);" data-i18n="city_why_p">${city.name} is ${city.desc}. Local businesses here need a technology and marketing partner who understands their market, speaks their language, and delivers real results.</p>
            </div>
            <div class="why-grid">
                <article class="why-card fade-up">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3 data-i18n="city_whychoose_local_title">Local to ${city.name}</h3>
                    <p data-i18n="city_whychoose_local_desc">We know the ${city.name} market, its neighborhoods, and what local customers are searching for.</p>
                </article>
                <article class="why-card fade-up">
                    <i class="fas fa-users"></i>
                    <h3 data-i18n="city_whychoose_homeservices">Built for Home Services</h3>
                    <p data-i18n="city_whychoose_homeservices_desc">We specialize in contractors, painters, cleaners, roofers, landscapers, and similar trades.</p>
                </article>
                <article class="why-card fade-up">
                    <i class="fas fa-language"></i>
                    <h3 data-i18n="city_whychoose_multilingual">Multilingual Team</h3>
                    <p data-i18n="city_whychoose_multilingual_desc">We serve English, Spanish, and Portuguese-speaking business owners throughout ${stateFull} and New England.</p>
                </article>
                <article class="why-card fade-up">
                    <i class="fas fa-award"></i>
                    <h3 data-i18n="city_whychoose_experience">19+ Years Experience</h3>
                    <p data-i18n="city_whychoose_experience_desc">Since 2006, we've helped hundreds of New England businesses grow with technology and marketing.</p>
                </article>
${whyExtraEN.map((item, i) => `                <article class="why-card fade-up">
                    <i class="${item.icon}"></i>
                    <h3 data-i18n="city_whychoose_extra${i}_title">${item.title}</h3>
                    <p data-i18n="city_whychoose_extra${i}_desc">${item.desc}</p>
                </article>`).join('\n')}
            </div>
        </div>
    </section>

    <!-- SERVICE FEATURES -->
    <section class="section-features" id="features">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:20px;">
                <span class="section-label"><i class="${svc.icon}"></i> <span data-i18n="city_features_label_text">${svc.shortTitle}</span></span>
                <h2 data-i18n="city_features_h2">${svc.title} for ${city.name} Businesses</h2>
                <p style="max-width:640px;margin:12px auto 0;color:var(--text-muted);" data-i18n="city_features_p">Everything your ${city.name} business needs to ${svcKey === 'crm-automation' ? 'organize leads, automate sales, and close more deals' : svcKey === 'seo-marketing' ? 'get found online, attract more customers, and grow revenue' : 'stay connected, protected, and professionally branded'}.</p>
            </div>
            <div class="features-grid">
${svc.features.map((f, i) => `                <article class="feature-card fade-up">
                    <div class="feature-icon"><i class="${f.icon}"></i></div>
                    <div>
                        <h3 data-i18n="city_feat${i}_title">${f.title}</h3>
                        <p data-i18n="city_feat${i}_desc">${f.desc}</p>
                    </div>
                </article>`).join('\n')}
            </div>
            <div style="text-align:center;margin-top:40px;" class="fade-up">
${svc.stats.map((s, i) => `                <span style="display:inline-flex;align-items:center;gap:8px;margin:8px 18px;font-size:0.95rem;color:var(--text-muted);"><i class="${s.icon}" style="color:var(--accent-gold);"></i> <span data-i18n="city_stat${i}">${s.text}</span></span>`).join('\n')}
            </div>
        </div>
    </section>

    <!-- INDUSTRIES -->
    <section class="section-industries" id="industries">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:20px;">
                <span class="section-label" data-i18n="city_industries_label">Industries We Serve</span>
                <h2 data-i18n="city_industries_h2_city">Home-Service Businesses We Help in ${city.name}</h2>
                <p style="max-width:640px;margin:12px auto 0;color:var(--text-muted);" data-i18n="city_industries_p_city">We specialize in helping contractors, tradespeople, and service professionals throughout ${city.name}, ${getStateAbbr(city)} grow their businesses with smart technology and proven marketing.</p>
            </div>
            <div class="industries-grid">
                <div class="industry-item fade-up">
                    <i class="fas fa-hard-hat"></i>
                    <div>
                        <h4 data-i18n="city_ind_construction">Construction</h4>
                        <p data-i18n="city_ind_construction_desc">General contractors, home builders, and renovation specialists</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-paint-roller"></i>
                    <div>
                        <h4 data-i18n="city_ind_painting">Painting</h4>
                        <p data-i18n="city_ind_painting_desc">Interior and exterior painting contractors</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-broom"></i>
                    <div>
                        <h4 data-i18n="city_ind_cleaning">Cleaning Services</h4>
                        <p data-i18n="city_ind_cleaning_desc">Residential and commercial cleaning companies</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-house-chimney"></i>
                    <div>
                        <h4 data-i18n="city_ind_roofing">Roofing & Siding</h4>
                        <p data-i18n="city_ind_roofing_desc">Roofing contractors and siding installers</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-leaf"></i>
                    <div>
                        <h4 data-i18n="city_ind_landscaping">Landscaping</h4>
                        <p data-i18n="city_ind_landscaping_desc">Landscapers, lawn care, and hardscaping professionals</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-plug"></i>
                    <div>
                        <h4 data-i18n="city_ind_electrical">Electricians</h4>
                        <p data-i18n="city_ind_electrical_desc">Licensed electricians and electrical contractors</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-wrench"></i>
                    <div>
                        <h4 data-i18n="city_ind_plumbing">Plumbing</h4>
                        <p data-i18n="city_ind_plumbing_desc">Plumbers and HVAC technicians</p>
                    </div>
                </div>
                <div class="industry-item fade-up">
                    <i class="fas fa-hammer"></i>
                    <div>
                        <h4 data-i18n="city_ind_carpentry">Carpentry</h4>
                        <p data-i18n="city_ind_carpentry_desc">Carpenters, cabinetmakers, and woodworkers</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PROCESS -->
    <section class="section-process" id="process">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:20px;">
                <span class="section-label" style="color:var(--accent-gold);" data-i18n="city_process_label">How It Works</span>
                <h2 data-i18n="city_process_h2_city">3 Simple Steps to Get Started</h2>
                <p style="max-width:580px;margin:12px auto 0;color:rgba(255,255,255,0.7);" data-i18n="city_process_p_city">Getting ${svc.shortTitle.toLowerCase()} for your ${city.name} business is easy. Here's how we work together.</p>
            </div>
            <div class="process-grid">
${svc.process.map((step, i) => `                <div class="process-step fade-up">
                    <div class="step-number"><i class="${step.icon}"></i></div>
                    <h3 data-i18n="city_proc${i}_title">Step ${i + 1}: ${step.title}</h3>
                    <p data-i18n="city_proc${i}_desc">${step.desc}</p>
                </div>`).join('\n')}
            </div>
        </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section-testimonials" id="testimonials">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:20px;">
                <span class="section-label" data-i18n="city_testimonials_label">Testimonials</span>
                <h2 data-i18n="city_testimonials_h2_city">What Business Owners Say About Galaxy IT</h2>
            </div>
            <div class="testimonials-grid">
${testimonials.map((t, i) => `                <article class="testimonial-card fade-up">
                    <div class="stars">${'<i class="fas fa-star"></i> '.repeat(t.rating)}</div>
                    <blockquote>"<span data-i18n="city_testimonial${i + 1}_text">${t.text}</span>"</blockquote>
                    <div class="author">${t.name} <span>— ${t.business}</span></div>
                </article>`).join('\n')}
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="section-faq" id="faq">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:0;">
                <span class="section-label" data-i18n="city_faq_label">FAQ</span>
                <h2 data-i18n="city_faq_h2">${svc.title} in ${city.name} — Frequently Asked Questions</h2>
            </div>
            <div class="faq-list">
${faqs.map((f, i) => `                <article class="faq-item fade-up" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 itemprop="name"><span data-i18n="city_faq_q${i}">${f.q}</span> <i class="fas fa-chevron-down"></i></h3>
                    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text" data-i18n="city_faq_a${i}">${f.a}</p>
                    </div>
                </article>`).join('\n')}
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
        <div class="container fade-up" style="text-align:center;">
            <h2 data-i18n="city_cta_h2_city">Ready to Grow Your ${city.name} Business?</h2>
            <p style="max-width:560px;margin:12px auto 28px;color:var(--text-muted);" data-i18n="city_cta_p">Get a free, no-obligation growth assessment from Galaxy IT & Marketing. We'll analyze your business and recommend the perfect strategy — completely free.</p>
            <a href="/consultation" class="btn btn-primary btn-lg">
                <i class="fas fa-calendar-check"></i> <span data-i18n="city_cta_btn">Get Your Free Assessment</span>
            </a>
            <p style="margin-top:16px;font-size:0.9rem;color:var(--text-muted);"><i class="fas fa-phone"></i> Or call us: <a href="tel:+15084999279" style="color:var(--accent-gold-dark);font-weight:600;">(508) 499-9279</a></p>
        </div>
    </section>

    <!-- NEARBY CITIES -->
    <section class="section-nearby">
        <div class="container" style="text-align:center;">
            <h3 style="color:var(--primary-dark);margin-bottom:4px;" data-i18n="city_nearby_h3_city">${svc.title} in Other ${stateFull} Cities</h3>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:0;" data-i18n="city_nearby_p">We also serve businesses in these nearby communities:</p>
            <div class="nearby-links">
${nearbyLinks.map((l, i) => `                <a href="/${svcKey}-${l.slug}-${l.state}" data-i18n="city_nearby_link${i}">${svc.shortTitle} in ${l.name}</a>`).join('\n')}
            </div>
            <div style="margin-top:18px;">
${otherServices.map((osKey, i) => {
  const os = services[osKey];
  return `                <a href="/${osKey}-${citySlug}-${stateSlug}" style="display:inline-block;margin:4px 8px;color:var(--accent-gold-dark);font-size:0.88rem;" data-i18n="city_also_link${i}">${os.title} in ${city.name}</a>`;
}).join('\n')}
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="/" class="logo">
                        <div class="logo-icon"><img src="../images/logo-white.svg" alt="Galaxy IT Logo"></div>
                        <div class="logo-text">Galaxy <span>IT</span></div>
                    </a>
                    <p data-i18n="footer_tagline">Technology that solves. Marketing that converts. Your trusted IT and marketing partner in New England since 2006.</p>
                    <div class="footer-social">
                        <a href="https://www.facebook.com/galaxymkt.us" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/galaxy.mkt" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.youtube.com/@galaxy_mkt" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4 data-i18n="footer_services">Services</h4>
                    <a href="/services#automation" data-i18n="services_card1_h3">Automation & Growth</a>
                    <a href="/services#marketing" data-i18n="services_card2_h3">Strategic Marketing</a>
                    <a href="/services#tech" data-i18n="services_card3_h3">Tech & Support</a>
                    <a href="/consultation" data-i18n="nav_cta">Free Assessment</a>
                </div>
                <div class="footer-col">
                    <h4 data-i18n="footer_company">Company</h4>
                    <a href="/about" data-i18n="footer_about">About Us</a>
                    <a href="/contact" data-i18n="nav_contact">Contact</a>
                    <a href="/support" data-i18n="footer_support">Help Center</a>
                    <a href="/consultation" data-i18n="nav_cta">Free Assessment</a>
                </div>
                <div class="footer-col">
                    <h4 data-i18n="footer_contact">Contact</h4>
                    <a href="tel:+15084999279"><i class="fas fa-phone"></i> (508) 499-9279</a>
                    <a href="mailto:info@galaxyinfo.us"><i class="fas fa-envelope"></i> info@galaxyinfo.us</a>
                    <a href="#"><i class="fas fa-map-marker-alt"></i> Worcester, MA</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p data-i18n="footer_copy">&copy; ${new Date().getFullYear()} Galaxy IT & Marketing. All rights reserved.</p>
                <div>
                    <span data-i18n="footer_privacy">Privacy Policy</span> &nbsp;&bull;&nbsp;
                    <span data-i18n="footer_terms">Terms of Service</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Get Support Button -->
    <a href="/support" class="get-support-btn" data-i18n="support_get_btn"><i class="fas fa-headset"></i> Get Support</a>

    <!-- WhatsApp Chat Widget -->
    <div class="whatsapp-widget" id="whatsappWidget">
        
            
            
        
    </div>

    <!-- Page-specific translations (MUST load before i18n.js) -->
    <script>window._cityTranslations = ${cityTransJSON};</script>
    <script src="../i18n.js"></script>
    <script src="../script.js"></script>
    <script>
    (function() {
        // City page form handler
        var form = document.getElementById('cityConsultForm');
        var wrap = document.getElementById('cityFormWrap');
        var success = document.getElementById('cityFormSuccess');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = form.querySelector('[name="name"]');
            var email = form.querySelector('[name="email"]');
            var phone = form.querySelector('[name="phone"]');
            if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) {
                alert('Please fill in all required fields.');
                return;
            }
            // Professional email validation
            var freeEmailDomains = ['gmail.com','yahoo.com','yahoo.com.br','hotmail.com','hotmail.com.br','outlook.com','outlook.com.br','aol.com','icloud.com','me.com','mac.com','live.com','live.com.br','msn.com','protonmail.com','proton.me','mail.com','zoho.com','yandex.com','gmx.com','gmx.net','inbox.com','fastmail.com','tutanota.com','tuta.com','bol.com.br','uol.com.br','terra.com.br','ig.com.br','globo.com','r7.com','zipmail.com.br'];
            var emailDomain = email.value.trim().toLowerCase().split('@')[1];
            if (emailDomain && freeEmailDomains.indexOf(emailDomain) !== -1) {
                alert('Please use a professional/business email address.');
                return;
            }
            var data = {};
            new FormData(form).forEach(function(v, k) { data[k] = v; });
            var btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            fetch('https://n8n.galaxyinfo.us/webhook/galaxy-consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function() {
                form.style.display = 'none';
                wrap.querySelector('h3').style.display = 'none';
                wrap.querySelector('p').style.display = 'none';
                success.classList.add('active');
            }).catch(function() {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-calendar-check"></i> <span data-i18n="city_form_btn">Get Free Assessment</span>';
                alert('Something went wrong. Please try again or call us at (508) 499-9279.');
            });
        });

        // FAQ toggle
        document.querySelectorAll('.faq-item h3').forEach(function(h3) {
            h3.addEventListener('click', function() {
                var item = h3.parentElement;
                var p = item.querySelector('div[itemscope] p') || item.querySelector('p');
                var icon = h3.querySelector('i');
                if (p.style.display === 'none') {
                    p.style.display = '';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                } else {
                    p.style.display = 'none';
                    if (icon) icon.style.transform = '';
                }
            });
        });
    })();
    </script>
</body>
</html>`;

  return html;
}

// ─── SITEMAP GENERATOR ───────────────────────────────────────────────────────
function generateSitemap(allPages) {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  for (const page of allPages) {
    xml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${page.url}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${page.url}?lang=es"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${page.url}?lang=pt"/>
  </url>
`;
  }
  xml += `</urlset>`;
  return xml;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function main() {
  const citiesDir = path.join(__dirname, 'cities');
  if (!fs.existsSync(citiesDir)) {
    fs.mkdirSync(citiesDir, { recursive: true });
  }

  const allPages = [];
  const rewrites = [];
  let count = 0;

  for (const svcKey of Object.keys(services)) {
    for (const city of cities) {
      const citySlug = slugify(city.name);
      const stateSlug = getStateSlug(city);
      const filename = `${svcKey}-${citySlug}-${stateSlug}.html`;
      const filepath = path.join(citiesDir, filename);
      const canonicalPath = `${svcKey}-${citySlug}-${stateSlug}`;
      const canonicalUrl = `https://galaxyinfo.us/${canonicalPath}`;

      const html = generatePage(city, svcKey);
      fs.writeFileSync(filepath, html, 'utf8');
      count++;

      allPages.push({ url: canonicalUrl, file: `cities/${filename}` });
      rewrites.push({
        source: `/${canonicalPath}`,
        destination: `/cities/${filename}`,
      });
    }
  }

  // Write sitemap
  const sitemapXml = generateSitemap(allPages);
  fs.writeFileSync(path.join(citiesDir, 'sitemap-cities.xml'), sitemapXml, 'utf8');
  console.log(`Generated sitemap-cities.xml with ${allPages.length} URLs`);

  // Write rewrites JSON
  fs.writeFileSync(
    path.join(__dirname, 'cities-rewrites.json'),
    JSON.stringify(rewrites, null, 2),
    'utf8'
  );
  console.log(`Generated cities-rewrites.json with ${rewrites.length} rewrite rules`);

  // Update vercel.json to include city rewrites
  const vercelPath = path.join(__dirname, 'vercel.json');
  let vercelConfig = {};
  if (fs.existsSync(vercelPath)) {
    vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  }
  const existingRewrites = (vercelConfig.rewrites || []).filter(
    r => !r.source.match(/^\/(crm-automation|seo-marketing|it-support)-/)
  );
  vercelConfig.rewrites = [...existingRewrites, ...rewrites];
  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2), 'utf8');
  console.log(`Updated vercel.json with ${rewrites.length} city rewrites (preserved ${existingRewrites.length} existing rewrites)`);

  console.log(`\nDone! Generated ${count} city service pages in ./cities/`);
  console.log(`  - ${cities.length} cities x ${Object.keys(services).length} services = ${count} pages`);
}

main();
