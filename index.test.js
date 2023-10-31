const {sequelize} = require('./db')
const {Restaurant, Menu} = require('./models/index')
const {
    seedRestaurant,
    seedMenu,
  } = require('./seedData');

describe('Restaurant and Menu Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        // Ensure all tests are self-contained
        await Restaurant.destroy({ truncate: true });
        await Menu.destroy({ truncate: true });
    });

    test('can create a Restaurant', async () => {
        const restaurant = await Restaurant.create({
            name: "Five Guys",
            location: "Stevenage",
            cuisine: "Fast Food"
        });

        expect(restaurant.name).toBe("Five Guys");
        expect(restaurant.location).toBe("Stevenage");
        expect(restaurant.cuisine).toBe("Fast Food");
    });

    test('can create a Menu', async () => {
        const menu = await Menu.create({
            title: "Five Guys Menu",
        });

        expect(menu.title).toBe("Five Guys Menu");
    });

    test('can find Restaurants', async () => {
        const find_me = await Restaurant.create({
            name: "Five Guys",
            location: "Stevenage",
            cuisine: "Fast Food"
        });

        await Restaurant.create({
            name: "Nandos",
            location: "Stevenage", /* Everything is in Stevenage, there is no escape */
            cuisine: "Fast Food"
        });

        const five_guys = await Restaurant.findByPk(find_me.id);

        expect(five_guys.name).toBe("Five Guys");
        expect(five_guys.location).toBe("Stevenage");
        expect(five_guys.cuisine).toBe("Fast Food");
        expect((await Restaurant.findAll()).length).toBe(2);
    });

    test('can find Menus', async () => {
        const find_me = await Menu.create({
            title: "Five Guys Menu",
        });

        await Menu.create({ title: "Nando's Menu" });
        await Menu.create({ title: "Zach's sandwiches" });

        const five_guys = await Menu.findOne({
            where: {
                title: "Five Guys Menu"
            }
        });

        expect(five_guys.title).toBe("Five Guys Menu");
        expect((await Menu.findAll()).length).toBe(3);
    });

    test("can update Restaurants", async () => {
        const ritz = await Restaurant.create({
            name: "The Ritz",
            location: "London",
            cuisine: "Fast Food" // Oh no! incorrect value!
        });

        await ritz.update({
            cuisine: "Pretentious"
        });

        expect(ritz.name).toBe("The Ritz");
        expect(ritz.location).toBe("London");
        expect(ritz.cuisine).toBe("Pretentious");
    });

    test("can update Menus", async () => {
        const ritz_menu = await Menu.create({
            title: "Nando's Menu" // Oh no! incorrect value!
        });

        await ritz_menu.update({ title: "Ritz' Menu" });

        expect(ritz_menu.title).toBe("Ritz' Menu");
    });

    test('can delete Restaurants', async () => {
        const delete_me = await Restaurant.create({
            name: "Five Guys",
            location: "Stevenage",
            cuisine: "Fast Food"
        });

        await Restaurant.create({
            name: "Nandos",
            location: "Stevenage",
            cuisine: "Fast Food"
        });

        await Restaurant.destroy({
            where: {
                id: delete_me.id
            }
        });

        const nandos = await Restaurant.findOne();

        expect(nandos.name).toBe("Nandos");
        expect(nandos.location).toBe("Stevenage");
        expect(nandos.cuisine).toBe("Fast Food");
    });

    test("can delete Menu", async () => {
        await Menu.create({ title: "Five Guys' Menu" });
        const delete_me = await Menu.create({ title: "McDonald's Menu" });
        await Menu.create({ title: "Nando's Menu" });

        await delete_me.destroy();

        expect((await Menu.findAll()).length).toBe(2);
    });
})
