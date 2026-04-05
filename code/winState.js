/**
	State that's shown when the player wins the game!
	Code by Rob Kleffner, 2011
*/

Mario.WinState = function() {
    this.waitTime = 2;
    this.drawManager = null;
    this.camera = null;
    this.font = null;
    this.kissing = null;
    this.wasKeyDown = false;
};

Mario.WinState.prototype = new Enjine.GameState();

// --- Hive Keychain Payout Integration ---
Mario.WinState.prototype.payoutPeakeCoin = function(amount, memo) {
    if (window.PekarioAuth && PekarioAuth.provider === "hive" && window.hive_keychain) {
        var username = PekarioAuth.username;
        // Use Hive Engine for PEAKECOIN transfer
        hive_keychain.requestCustomJson(
            username, // user
            "ssc-mainnet-hive", // Hive Engine custom_json id
            "Active", // authority
            JSON.stringify({
                contractName: "tokens",
                contractAction: "transfer",
                contractPayload: {
                    symbol: "PEAKECOIN",
                    to: username,
                    quantity: amount.toString(),
                    memo: memo || "Congrats on winning!"
                }
            }),
            "Payout for winning a level in Pekario",
            function(response) {
                if (response.success) {
                    alert("Payout successful! You received " + amount + " PEAKECOIN.");
                } else {
                    alert("Payout failed: " + (response.message || "Unknown error"));
                }
            }
        );
    }
};

Mario.WinState.prototype.Enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();
    
    this.font = Mario.SpriteCuts.CreateBlackFont();
    this.font.Strings[0] = { String: "Thank you for saving me, Mario!", X: 36, Y: 160 };
    
    this.kissing = new Enjine.AnimatedSprite();
    this.kissing.Image = Enjine.Resources.Images["endScene"];
    this.kissing.X = 112;
    this.kissing.Y = 52;
    this.kissing.SetColumnCount(2);
    this.kissing.SetRowCount(1);
    this.kissing.AddNewSequence("loop", 0, 0, 0, 1);
    this.kissing.PlaySequence("loop", true);
    this.kissing.FramesPerSecond = 1/2;
    
    this.waitTime = 2;
    
    this.drawManager.Add(this.font);
    this.drawManager.Add(this.kissing);
    // --- Payout logic ---
    if (window.PekarioAuth && PekarioAuth.provider === "hive") {
        this.payoutPeakeCoin(10, "Level completed in Pekario!"); // 10 PEAKECOIN payout
    }
};

Mario.WinState.prototype.Exit = function() {
    this.drawManager.Clear();
    delete this.drawManager;
    delete this.camera;
};

Mario.WinState.prototype.Update = function(delta) {
    this.drawManager.Update(delta);
    
    if (this.waitTime > 0) {
        this.waitTime -= delta;
    } else {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            this.wasKeyDown = true;
        }
    }
};

Mario.WinState.prototype.Draw = function(context) {
    this.drawManager.Draw(context, this.camera);
};

Mario.WinState.prototype.CheckForChange = function(context) {
    if (this.waitTime <= 0) {
        if (this.wasKeyDown && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            context.ChangeState(new Mario.TitleState());
        }
    }
};