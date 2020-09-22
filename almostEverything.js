let conf = {w: prompt("Enter webhook url.")};

        let whooks = {
            "default": newData()
        }

        function setContent(val) { //setContent.apply(data, [val]);
            let currentBody = JSON.parse(this.body);
            currentBody.content = val;
            this.body = JSON.stringify(currentBody);
            refreshOut();
            document.getElementById("content-input").value = "";
        }

        function setUsername(val) { //setUsername.apply(data, [val]);
            let currentBody = JSON.parse(this.body);
            currentBody.username = val;
            this.body = JSON.stringify(currentBody);
            refreshOut();
        }

        function setAvatar(val) { //setAvatar.apply(data, [val]);
            let currentBody = JSON.parse(this.body);
            currentBody.avatar_url = val;
            this.body = JSON.stringify(currentBody);
            refreshOut();
        }

        function changeUrl(url) {
            conf.w = url;
        }

        function send() {
            return new Promise((resolve, reject) => {
                fetch(conf.w, whooks[document.getElementById("webhook-selector").value])
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
            })
        }

        function newData() {
            let data = {
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "body": JSON.stringify({"content": "example"})
            }
            return data;
        }

        function newWebhook(name) {
            if(!name) return;
            if(Object.keys(whooks).includes(name)) {
                alert("Invalid name");
                return;
            }
            if(name.replace(/\s/g, '').length == 0) {
                alert("Invalid name")
                return;
            }
            whooks[name] = newData();
            refreshSelectOptions();
        }

        function refreshSelectOptions() {
            let select = document.getElementById("webhook-selector");

            select.innerHTML = "";
            
            Object.keys(whooks).forEach(elm => {
                let option = new Option(elm, elm)
                select.appendChild(option);
            })
        }

        async function loaded() {
            refreshSelectOptions();
            document.getElementById("webhook-selector").addEventListener("change", () => refreshOut());
            document.getElementById("content-input").addEventListener("change", () => refreshContent());

            await fetch(conf.w)
                .then(res => res.json())
                .then(data => {
                    conf.data = data;
                })
                .catch(e => {
                    alert(`FAILED TO ACCESS THE WEBHOOK \n${e}`);
                })

            refreshOut();
        }

        function refreshOut() {
            let avatar = document.getElementById("avatar");
            let username = document.getElementById("username");
            let webhook_name = document.getElementById("webhook-selector").value

            let avatar_url = JSON.parse(whooks[webhook_name].body).avatar_url;
            if(avatar_url) {
                avatar.src = avatar_url;
            } else if(conf.data.avatar) {
                avatar_url = `https://cdn.discordapp.com/avatars/${conf.data.id}/${conf.data.avatar}`
                avatar.src = avatar_url;
            }

            let username_ = JSON.parse(whooks[webhook_name].body).username;
            if(username_) {
                username.innerHTML = username_;
            } else {
                username.innerHTML = conf.data.name;
            }

            refreshContent();
        }
        
        function refreshContent() {
            let webhook_name = document.getElementById("webhook-selector").value
            let content = document.getElementById("content");
            content.innerHTML = formatter(JSON.parse(whooks[webhook_name].body).content);
        }
        
        function formatter(val) {
            return val;
        }