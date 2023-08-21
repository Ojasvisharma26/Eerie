class Pagination {
    constructor(msg, embeds, options = {}) {
        this.msg = msg;
        this.embeds = embeds;
        this.pageIndex = 0;
        this.options = options;
        this.reactions = {
            '<:btn_left:1140929178728931419>': 'previousPage',
            '<:btn_right:1140929182755471440>': 'nextPage'
        };
    }

    async send() {
        if (this.embeds.length === 1) return this.msg.editReply({ embeds: [this.embeds[0]] });

        this.message = await this.msg.editReply({ embeds: [this.updateFooter(this.embeds[this.pageIndex])] });
        await this.addReactions();

        this.collector = this.message.createReactionCollector(
            (reaction, user) => Object.keys(this.reactions).includes(reaction.emoji.toString()) && !user.bot,
            { time: 30000 }
        );

        this.collector.on('collect', reaction => {
    const user = reaction.users.cache.filter(user => !user.bot).first();
    if (user) {
        reaction.users.remove(user.id);  // Remove user's reaction
        const reactionHandler = this[this.reactions[reaction.emoji.toString()]];
        if (reactionHandler) reactionHandler.call(this);
    }
});

        this.collector.on('end', () => {
            this.message.reactions.removeAll().catch(err => console.error('Failed to clear reactions: ', err));
        });
    }

    async addReactions() {
        for (const reaction in this.reactions) {
            await this.message.react(reaction);
        }
    }

    nextPage() {
        if (this.pageIndex < this.embeds.length - 1) {
            this.pageIndex++;
            this.message.edit({ embeds: [this.updateFooter(this.embeds[this.pageIndex])] });
        }
    }

    previousPage() {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.message.edit({ embeds: [this.updateFooter(this.embeds[this.pageIndex])] });
        }
    }

    updateFooter(embed) {
        const updatedEmbed = Object.assign({}, embed); // Create a shallow copy to avoid direct modifications
        updatedEmbed.footer = {
            text: `Page ${this.pageIndex + 1} of ${this.embeds.length}`
        };
        return updatedEmbed;
    }
}

module.exports = Pagination;
