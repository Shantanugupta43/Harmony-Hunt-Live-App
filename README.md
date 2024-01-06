<h1> Harmony Hunt Application - Available on Google Play </h1>

<h2> Mission </h2>

On a mission to give small / mid emerging artists the visibility they need! 

<p>Addressing the challenges artists face in gaining visibility on streaming services at the early stages of their careers.</p>

<p>It is not just a streaming service but also a talent hunting platform where users hunt for their favourite music exploring different genres, the purpose of this is to give talented artists the visibility they often struggle at the start.

<h2>API info </h2>

The app fetches latest tracks from Jamendo API.


<h2> Main Components</h2>

<b> App.js</b>

<p> Contains main architecture of the application - API calls, playback adjustments, sliders etc.</p>


```

      // Make the API request
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks', {
        params: {
          tags: `'${genre.toLowerCase()}'`,
          limit: 200,
          client_id: 'API KEY ',
          order: 'releasedate_desc',
          vocalinstrumental:'vocal',
          audiodlformat: 'mp32',
        },
      });

```

Make sure to add the <b> API KEY </b> from Jamendo's website.


<p>To obtain an API key from Jamendo, you need to follow these steps:</p>

<b> Create a Jamendo Account:</b>
<p> - If you don't have a Jamendo account, you need to create one. Visit the Jamendo website (https://www.jamendo.com/start) and sign up for an account.</p>

<b> Log in to Your Jamendo Account:</b>
<p> - Once you have created an account, log in to the Jamendo website using your credentials.</p>

<b> Access the Developer Section:</b>
<p> - After logging in, go to the Jamendo Developer Section. You can usually find this in the website's footer under "Developers" or by visiting a specific URL. For example, the developer section URL might be: https://developer.jamendo.com/start.</p>

<b> Create a New Application:</b>
<p> - Inside the developer section, you'll need to create a new application to obtain an API key. Look for an option like "Create a new application" or "Register a new app." Provide the required information about your application, such as the name, description, and purpose.</p>

<b> Obtain the API Key:</b>
<p> - Once you've registered your application, you should receive an API key. This key is essential for making requests to the Jamendo API. Copy the API key and keep it secure, as it will be used to authenticate your requests.</p>



<b>IntroScreen.js</b>

<p>Contains popup allowing users to choose a genre</p>


<b>CustomWidgets.js</b>


<p>Contains Widget Properties such as play, pause, next, previous. </p>


<h2> Running the project (Terminal) [Windows] </h2>

- Clone the project - ``` git clone https://github.com/Shantanugupta43/Harmony-Hunt-Live-App.git  ```
- Get in the directory - ``` cd harmony-hunt ```
- Run command - ``` npx expo start  ```


<h2>Deploying the Project (Terminal) [Windows] </h2>

- Create a branch ``` git branch <BRANCH_NAME> ```
- Switch to your branch ```  git checkout <BRANCH_NAME> ```
- Add changes ``` git add . ```
- Commit changes ``` git commit -m "<COMMIT_NAME>" ```
- Push Changes ``` git push -u origin <BRANCH_NAME> ```


<h2> Contributing </h2>

Feel free to issue a pull request of your branch and collaborate. This project supports open source contributions from other developers.
