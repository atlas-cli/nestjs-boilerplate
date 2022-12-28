curl -u ${CIRCLECI_TOKEN}: -X POST --header "Content-Type: application/json" -d "{
  \"parameters\": {
    \"diff-$1\": $2
  }
}" https://circleci.com/api/v2/project/:project_slug/pipeline