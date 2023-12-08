#!/bin/bash
clear
echo "                            ___                 ____    __                          __  __           __        "
echo " /'\_/\`\  __          __  /'___\ __            /\  _\`\ /\ \                        /\ \/\ \         /\ \       "
echo "/\      \/\_\    ___ /\_\/\ \__//\_\     __    \ \,\L\_\ \ \___     ___   _____    \ \ \_\ \  __  __\ \ \____  "
echo "\ \ \__\ \/\ \ /' _ \`\/\ \ \ ,__\/\ \  /'_ \`\   \/_\__ \\ \  _ \`\  / __\`\/\ '__ \`\   \ \  _  \/\ \/\ \\ \ '__\`\ "
echo " \ \ \_/\ \ \ \/\ \/\ \ \ \ \ \_/\ \ \/\ \L\ \    /\ \L\ \ \ \ \ \/\ \L\ \ \ \L\ \   \ \ \ \ \ \ \_\ \\ \ \L\ \ "
echo "  \ \_\\ \_\ \_\ \_\ \_\ \_\ \_\  \ \_\ \____ \    \ \`\____\ \_\ \_\ \____/\ \ ,__/    \ \_\ \_\ \____/ \ \_,__/"
echo "   \/_/ \/_/\/_/\/_/\/_/\/_/\/_/   \/_/\/___L\ \   \/_____/\/_/\/_/\/___/  \ \ \/      \/_/\/_/\/___/   \/___/ "
echo "                                         /\____/                            \ \_\\"
echo "                                         \_/__/                              \/_/"

#sleep 2

# get version number from package.json
currentVersion=$(grep -Eoi '"version": "\d+\.\d+\.\d+",' ./package.json)
currentVersion="${currentVersion/\"version\": /""}"
currentVersion="${currentVersion//\"/""}"
currentVersion="${currentVersion/,/""}"

# show version number to see if we want to update
echo "Current Version: $currentVersion"
echo "Would you like to update the version?"
printf "Enter the new version number, or hit Enter to use current version (x.x.x): "
read -r newVersion

# check if input is valid
valid="^[0-9]+\.[0-9]+\.[0-9]+$"
if [[ ! $newVersion =~ $valid && $newVersion != "" ]]; then
  echo "Invalid input, exiting!"
  exit
fi

# check to see if version is different, if it is, update package.json
if [[ $currentVersion == "$newVersion" || $newVersion == "" ]]
then
  echo "Keeping version $currentVersion!"
  newVersion=$currentVersion
else
  # ask if we want to commit it to the project repo
  echo "Would you like to commit the version change? (y/n)"
  printf " : "
  read -r yn
  printf "Updating version in package.json..."
  sed -i '' "1,+5 s|$currentVersion|$newVersion|g" ./package.json
  echo "Done."
  if [[ $yn == "y" || $yn == "Y" ]]; then
    echo "Committing version update..."
    git add package.json
    git commit -m "Version update to $newVersion"
    git push
  else
    echo "Skipping version commit!"
  fi
fi
echo

# determine if deploying to staging or prod
echo "Deploy to staging or production?"
echo "  0 : Staging"
echo "  1 : Production"
printf "    : "
read -r deployEnvironment

if [[ $deployEnvironment == "0" ]]
then
  echo "Deploying to Staging!"
elif [[ $deployEnvironment == "1" ]]
then
  echo "Deploying to Production!"

  # setting prod environment for deployment
  printf "Setting environment to production..."
  sed -i '' 's/REACT_APP_ENVIRONMENT=dev/REACT_APP_ENVIRONMENT=prod/g' ./.env
  echo "Done."
else
  echo "Unknown input, exiting!"
  exit
fi

# build the app
npm run build

# cleanup
printf "Cleaning up/Moving files around..."
if [[ $deployEnvironment == "0" ]]
then
  if [ -d /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/minifig-shop-hub-staging ]; then
    rm -r /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/minifig-shop-hub-staging
  fi
  mv build /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/minifig-shop-hub-staging
elif [[ $deployEnvironment == "1" ]]
then
  if [ -d /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/minifig-shop-hub ]; then
    rm /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/minifig-shop-hub
  fi
  mv build /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io/projects/minifig-shop-hub
fi

# deploy
echo "Deploying..."
# shellcheck disable=SC2164
cd /Users/mpfthprblmtq/Git/mpfthprblmtq.github.io
if [[ $deployEnvironment == "0" ]]; then
  git add projects/minifig-shop-hub-staging/.
  git commit -m "Deploying staging version $newVersion of minifig shop hub"
elif [[ $deployEnvironment == "1" ]]; then
  git add projects/minifig-shop-hub/.
  git commit -m "Deploying version $newVersion of minifig shop hub"
fi
git push
echo "Done."

# setting back to dev environment
# shellcheck disable=SC2164
cd /Users/mpfthprblmtq/Git/MinifigShopHub
printf "Setting environment back to dev..."
sed -i '' 's/REACT_APP_ENVIRONMENT=prod/REACT_APP_ENVIRONMENT=dev/g' ./.env
echo "Done."