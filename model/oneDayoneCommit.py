from github import Github
from datetime import datetime, timezone

class oneDayOneCommit:
    def __init__(self, token):
        self.token = token
        self.g = Github(login_or_token = self.token)
        self.user_name = self.g.get_user().name
    def utc_to_local(self,utc_dt):
        return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None)

    def get_local_time(self):
        dt = datetime.now()
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    
    def get_latest_commit(self):
        # print(self.g.get_user().name)
        # for i in g.get_user().get_repos():
        #     print(i.name)

        latest_commit = sorted([i for i in self.g.get_user(self.user_name).get_events() if i.type == 'PushEvent'],key = lambda t: t.created_at,reverse = True)[0]
        ret = {}
        ret['repo-name'] = latest_commit.repo.name
        ret['commit-msg'] = latest_commit.payload['commits'][0]['message']
        ret['commit-time-UTC0'] = str(latest_commit.created_at)
        ret['commit-time-local'] = str(self.utc_to_local(latest_commit.created_at))
        return ret
    
    def is_today(self):
        latest_commit_dict = self.get_latest_commit()

        last_commit = latest_commit_dict['commit-time-local'].split()[0].split("-")
        today = self.get_local_time().split()[0].split("-")

        last_commit = last_commit[0]*365 + last_commit[1]*31 + last_commit[2]
        today = today[0]*365 + today[1]*31 + today[2]

        if(last_commit != today):
            return False
        else:
            return True

if __name__ == "__main__":
    f = open("1day1commit.txt", 'r')
    key = f.readline().replace("\n","")
    testA = oneDayOneCommit(key)
    print(testA.get_latest_commit())
    print(testA.is_today())

    f.close()