#include<bits/stdc++.h>
using namespace std;
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;

template<typename T> using ordered_set =tree<T, null_type,less<T>, rb_tree_tag,tree_order_statistics_node_update>;
//order_of_key (k) : Number of items strictly smaller than k .
//find_by_order(k) : K-th element in a set (counting from zero).
template<typename T> using ordered_multiset = tree<T, null_type,less_equal<T>, rb_tree_tag,tree_order_statistics_node_update>;
//Erase -
//if(os.upper_bound(x)!=os.end())
//    os.erase(os.upper_bound(x));
//gp_hash_table

#define ll long long
#define pb push_back
#define mp make_pair
#define F first
#define S second
#define PI 3.1415926535897932384626
#define all(x) x.begin(),x.end()
#define endl '\n'
#define MOD 1000000007

void solve() {
    int n;
    cin>>n;
    string s;
    cin>>s;
    string s1=s;
    sort(s1.begin(),s1.end());
    if(s1==s)
    {
        cout<<"Bob"<<endl;return;
    }
    int t=0;
    int l=0,r=n-1;
    int ans1=INT_MAX,ans2=INT_MIN;
    while(l<r)
    {
        int cnt=0;
        while(s[l]=='1')
        {
            cnt++;ans1=min(ans1,l);
            l++;
            
        }
        while(cnt>0)
        {
            if(s[r]=='0')
            {
                cnt--;ans2=max(ans2,r);
                r--;
                
            }
            else
            {
                r--;
            }
        }
        t++;
    }
    if(t%2!=0)
    {
        cout<<"Alice"<<endl;
        cout<<2<<endl;
        cout<<ans1+1<<" "<<ans2+1<<endl;
    }
    else
    {
        cout<<"Bob"<<endl;
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t = 1;
    cin >> t;
    while(t--) {
        solve();
    }
    return 0;
}