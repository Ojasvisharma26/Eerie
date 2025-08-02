const fs = require('fs');

module.exports = (client) => {
    const { buttons, selectMenus, modals } = client;

    client.handleComponents = async () => {
        const componentsFolder = fs.readdirSync('./src/components');
        for (const folder of componentsFolder) {
            const componentDirs = fs.readdirSync(`./src/components/${folder}`);

            switch (folder) {
                case "buttons":
                    let but = 0;
                    for (const dir of componentDirs) {
                        const pathToCheck = `./src/components/${folder}/${dir}`;

                        if (fs.lstatSync(pathToCheck).isDirectory()) {
                            const componentFiles = fs.readdirSync(pathToCheck).filter((file) => file.endsWith(".js"));

                            for (const file of componentFiles) {
                                const component = require(`../../components/${folder}/${dir}/${file}`);
                                if (typeof component === 'object' && component.data && component.data.name) {
                                    but++;
                                    buttons.set(component.data.name, component);
                                } else {
                                    console.warn(`File ${file} does not match expected button structure and will be skipped.`);
                                }
                            }
                        } else if (pathToCheck.endsWith(".js")) {
                            const button = require(`../../components/${folder}/${dir}`);
                            if (button.data && button.data.name) {
                                but++;
                                buttons.set(button.data.name, button);
                            } else {
                                console.warn(`File ${dir} does not match expected button structure and will be skipped.`);
                            }
                        }
                    }
                    console.log(client.chalk.blue(`[HANDLER] - Loaded ${but} Button(s)!`));
                    break;

                case "selectMenus":
                    let sm = 0;
                    for (const dir of componentDirs) {
                        const componentFiles = fs.readdirSync(`./src/components/${folder}/${dir}`).filter((file) => file.endsWith(".js"));
                        for (const file of componentFiles) {
                            const selectMenu = require(`../../components/${folder}/${dir}/${file}`);
                            sm++;
                            selectMenus.set(selectMenu.data.name, selectMenu);
                        }
                    }
                    console.log(client.chalk.blue(`[HANDLER] - Loaded ${sm} Select Menu(s)!`));
                    break;

                case "modals":
                    let modalss = 0;
                    for (const dir of componentDirs) {
                        const componentFiles = fs.readdirSync(`./src/components/${folder}/${dir}`).filter((file) => file.endsWith(".js"));
                        for (const file of componentFiles) {
                            const modal = require(`../../components/${folder}/${dir}/${file}`);
                            modalss++;
                            modals.set(modal.data.name, modal);
                        }
                    }
                    console.log(client.chalk.blue(`[HANDLER] - Loaded ${modalss} Modal(s)!`));
                    break;

                default:
                    break;
            }
        }
    };
};
